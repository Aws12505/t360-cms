<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\DriverApplication;
use App\Models\DriverApplicationNote;
use App\Models\DriverPosition;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\StreamedResponse;

class DriverApplicationController extends Controller
{
    public function index(Request $request)
    {
        $filters = $this->filters($request);

        // Load the opened application first so it is already marked read in the list below
        $selected = null;
        if ($viewId = $request->integer('view')) {
            $selected = $this->detail(DriverApplication::findOrFail($viewId));
        }

        $applications = $this->query($filters)
            ->with('positionRows:id,driver_application_id,driver_position_id,position_title')
            ->latest()
            ->paginate(25)
            ->withQueryString();

        // Status counts respect every filter except status itself, so the tabs stay meaningful
        $counts = $this->query(array_merge($filters, ['status' => 'all']))
            ->selectRaw('status, count(*) as total')
            ->groupBy('status')
            ->pluck('total', 'status');

        return Inertia::render('Admin/Drivers/Applications/Index', [
            'applications' => $applications,
            'filters' => $filters,
            'counts' => [
                'all' => (int) $counts->sum(),
                'new' => (int) ($counts['new'] ?? 0),
                'contacted' => (int) ($counts['contacted'] ?? 0),
                'hired' => (int) ($counts['hired'] ?? 0),
                'not_a_fit' => (int) ($counts['not_a_fit'] ?? 0),
            ],
            'stats' => [
                'last30' => DriverApplication::where('created_at', '>=', now()->subDays(30))->count(),
                'unread' => DriverApplication::whereNull('read_at')->count(),
                'openPositions' => DriverPosition::published()->count(),
            ],
            'positions' => DriverPosition::withTrashed()->orderBy('title')->get(['id', 'title', 'status', 'deleted_at']),
            'statusLabels' => DriverApplication::STATUS_LABELS,
            'selected' => $selected,
        ]);
    }

    public function show(DriverApplication $driverApplication)
    {
        return Inertia::render('Admin/Drivers/Applications/Show', [
            'application' => $this->detail($driverApplication),
            'statusLabels' => DriverApplication::STATUS_LABELS,
        ]);
    }

    public function status(Request $request, DriverApplication $driverApplication)
    {
        $data = $request->validate([
            'status' => ['required', Rule::in(DriverApplication::STATUSES)],
        ]);

        $this->changeStatus($driverApplication, $data['status'], $request->user()?->id);

        return back()->with('success', 'Status updated to ' . DriverApplication::STATUS_LABELS[$data['status']] . '.');
    }

    public function bulkStatus(Request $request)
    {
        $data = $request->validate([
            'ids' => 'required|array|min:1|max:500',
            'ids.*' => 'integer',
            'status' => ['required', Rule::in(DriverApplication::STATUSES)],
        ]);

        $applications = DriverApplication::whereIn('id', $data['ids'])->get();
        foreach ($applications as $application) {
            $this->changeStatus($application, $data['status'], $request->user()?->id);
        }

        return back()->with('success', $applications->count() . ' application(s) marked ' . DriverApplication::STATUS_LABELS[$data['status']] . '.');
    }

    public function markUnread(DriverApplication $driverApplication)
    {
        $driverApplication->update(['read_at' => null]);

        // Return to the list without re-opening it (opening marks it read again)
        $previous = url()->previous();
        parse_str((string) parse_url($previous, PHP_URL_QUERY), $query);
        unset($query['view']);
        $target = str_contains($previous, '/admin/driver-applications') && !str_contains($previous, "/driver-applications/{$driverApplication->id}")
            ? route('admin.driver-applications.index', $query)
            : route('admin.driver-applications.index');

        return redirect($target)->with('success', 'Marked as unread.');
    }

    public function storeNote(Request $request, DriverApplication $driverApplication)
    {
        $data = $request->validate([
            'body' => 'required|string|max:5000',
        ]);

        $driverApplication->log('note', trim($data['body']), $request->user()?->id);

        return back()->with('success', 'Note added.');
    }

    public function destroyNote(DriverApplicationNote $note)
    {
        abort_unless($note->type === 'note', 403);
        $note->delete();

        return back()->with('success', 'Note deleted.');
    }

    public function destroy(DriverApplication $driverApplication)
    {
        $driverApplication->delete();

        return redirect()
            ->route('admin.driver-applications.index')
            ->with('success', 'Application deleted.');
    }

    public function export(Request $request): StreamedResponse
    {
        $filters = $this->filters($request);
        $filename = 'driver-applications-' . now()->format('Y-m-d') . '.csv';

        return response()->streamDownload(function () use ($filters) {
            $out = fopen('php://output', 'w');
            fputcsv($out, ['ID', 'Applied', 'Status', 'First name', 'Last name', 'Email', 'Phone', 'Positions', 'Availability', 'Valid CDL-A', 'CDL-A experience', 'Source', 'Latest note']);

            $this->query($filters)
                ->with(['positionRows', 'notes' => fn ($q) => $q->where('type', 'note')])
                ->latest()
                ->chunk(500, function ($rows) use ($out) {
                    foreach ($rows as $a) {
                        fputcsv($out, array_map([$this, 'csvSafe'], [
                            $a->id,
                            $a->created_at->format('Y-m-d H:i'),
                            DriverApplication::STATUS_LABELS[$a->status] ?? $a->status,
                            $a->first_name,
                            $a->last_name,
                            $a->email,
                            $a->phone,
                            implode('; ', $a->positionTitles()),
                            $a->availability,
                            $a->has_cdl_a ? 'Yes' : 'No',
                            $a->experience_years,
                            $a->source_url,
                            optional($a->notes->first())->body,
                        ]));
                    }
                });

            fclose($out);
        }, $filename, ['Content-Type' => 'text/csv; charset=UTF-8']);
    }

    /**
     * Neutralise spreadsheet formula injection in exported values.
     */
    public function csvSafe($value)
    {
        $value = (string) $value;
        return preg_match('/^[=+\-@\t\r]/', $value) ? "'" . $value : $value;
    }

    private function changeStatus(DriverApplication $application, string $status, ?int $userId): void
    {
        $from = $application->status;
        if ($from === $status) {
            return;
        }

        $application->update(['status' => $status, 'read_at' => $application->read_at ?? now()]);
        $application->log(
            'status_change',
            'Status changed from ' . (DriverApplication::STATUS_LABELS[$from] ?? $from) . ' to ' . DriverApplication::STATUS_LABELS[$status],
            $userId,
            ['from' => $from, 'to' => $status]
        );
    }

    private function detail(DriverApplication $application): array
    {
        if (!$application->read_at) {
            $application->forceFill(['read_at' => now()])->save();
        }

        $application->load([
            'positionRows.position:id,title,slug,status,deleted_at',
            'notes.user:id,name',
            'sourcePosition:id,title,slug',
        ]);

        return array_merge($application->toArray(), [
            'position_titles' => $application->positionTitles(),
        ]);
    }

    private function filters(Request $request): array
    {
        $status = $request->get('status', 'all');

        return [
            'status' => in_array($status, array_merge(['all'], DriverApplication::STATUSES), true) ? $status : 'all',
            'position' => $request->get('position') ?: null,
            'q' => trim((string) $request->get('q', '')) ?: null,
            'from' => $request->get('from') ?: null,
            'to' => $request->get('to') ?: null,
        ];
    }

    private function query(array $filters): Builder
    {
        return DriverApplication::query()
            ->when($filters['status'] !== 'all', fn ($q) => $q->where('status', $filters['status']))
            ->when($filters['position'] === 'any', fn ($q) => $q->whereDoesntHave('positionRows'))
            ->when($filters['position'] && $filters['position'] !== 'any', fn ($q) => $q->whereHas(
                'positionRows',
                fn ($p) => $p->where('driver_position_id', (int) $filters['position'])
            ))
            ->when($filters['q'], function ($q) use ($filters) {
                $term = '%' . str_replace(['%', '_'], ['\%', '\_'], $filters['q']) . '%';
                $digits = preg_replace('/\D/', '', $filters['q']);
                $fullName = DB::connection()->getDriverName() === 'sqlite'
                    ? "first_name || ' ' || last_name"
                    : "CONCAT(first_name, ' ', last_name)";
                $q->where(function ($w) use ($term, $digits, $fullName) {
                    $w->where('first_name', 'like', $term)
                        ->orWhere('last_name', 'like', $term)
                        ->orWhereRaw("{$fullName} like ?", [$term])
                        ->orWhere('email', 'like', $term)
                        ->orWhere('phone', 'like', $term);
                    if (strlen($digits) >= 3) {
                        $w->orWhereRaw("REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(phone, ' ', ''), '-', ''), '(', ''), ')', ''), '.', '') like ?", ['%' . $digits . '%']);
                    }
                });
            })
            ->when($filters['from'], fn ($q) => $q->whereDate('created_at', '>=', $filters['from']))
            ->when($filters['to'], fn ($q) => $q->whereDate('created_at', '<=', $filters['to']));
    }
}
