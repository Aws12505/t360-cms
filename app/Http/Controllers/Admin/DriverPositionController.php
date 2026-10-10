<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\DriverPosition;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class DriverPositionController extends Controller
{
    public function index(Request $request)
    {
        $status = $request->get('status', 'all');

        $positions = DriverPosition::query()
            ->withCount('applications')
            ->when($status !== 'all', fn ($q) => $q->where('status', $status))
            ->ordered()
            ->get()
            ->map(fn (DriverPosition $p) => array_merge($p->toArray(), [
                'public_status' => $p->publicStatus(),
                'cover_image_url' => $p->cover_image ? Storage::url($p->cover_image) : null,
            ]));

        $counts = DriverPosition::selectRaw('status, count(*) as total')->groupBy('status')->pluck('total', 'status');

        return Inertia::render('Admin/Drivers/Positions/Index', [
            'positions' => $positions,
            'currentStatus' => $status,
            'counts' => [
                'all' => (int) $counts->sum(),
                'draft' => (int) ($counts['draft'] ?? 0),
                'published' => (int) ($counts['published'] ?? 0),
                'closed' => (int) ($counts['closed'] ?? 0),
            ],
            'websiteUrl' => rtrim(config('services.website.url'), '/'),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Drivers/Positions/Form', $this->formProps(null));
    }

    public function store(Request $request)
    {
        $data = $this->validated($request);
        $data = $this->handleImages($request, $data);

        $position = DriverPosition::create($data);

        return redirect()
            ->route('admin.driver-positions.edit', $position)
            ->with('success', $position->status === 'published' ? 'Position published.' : 'Position saved.');
    }

    public function edit(DriverPosition $driverPosition)
    {
        return Inertia::render('Admin/Drivers/Positions/Form', $this->formProps($driverPosition));
    }

    public function update(Request $request, DriverPosition $driverPosition)
    {
        $data = $this->validated($request, $driverPosition);
        $data = $this->handleImages($request, $data, $driverPosition);

        $driverPosition->update($data);

        return back()->with('success', 'Position updated.');
    }

    /**
     * Dedicated status endpoint (publish / close / back to draft) so list toggles
     * don't have to send every field through full validation.
     */
    public function status(Request $request, DriverPosition $driverPosition)
    {
        $data = $request->validate([
            'status' => ['required', Rule::in(DriverPosition::STATUSES)],
        ]);

        $updates = ['status' => $data['status']];

        // Re-publishing an expired posting: clear the stale end date
        if ($data['status'] === 'published' && $driverPosition->valid_through?->endOfDay()->isPast()) {
            $updates['valid_through'] = null;
        }

        $driverPosition->update($updates);

        $label = ['draft' => 'moved to drafts', 'published' => 'published', 'closed' => 'closed'][$data['status']];

        return back()->with('success', "Position {$label}.");
    }

    public function duplicate(DriverPosition $driverPosition)
    {
        $copy = $driverPosition->replicate(['slug', 'date_posted']);
        $copy->title = $driverPosition->title . ' (copy)';
        $copy->slug = null;
        $copy->status = 'draft';
        $copy->is_featured = false;
        $copy->save();

        return redirect()
            ->route('admin.driver-positions.edit', $copy)
            ->with('success', 'Position duplicated as a draft.');
    }

    public function destroy(DriverPosition $driverPosition)
    {
        $driverPosition->delete();

        return redirect()
            ->route('admin.driver-positions.index')
            ->with('success', 'Position deleted.');
    }

    private function formProps(?DriverPosition $position): array
    {
        return [
            'position' => $position ? array_merge($position->toArray(), [
                'cover_image_url' => $position->cover_image ? Storage::url($position->cover_image) : null,
                'og_image_url' => $position->og_image ? Storage::url($position->og_image) : null,
                'applications_count' => $position->applications()->count(),
                'public_status' => $position->publicStatus(),
            ]) : null,
            'options' => [
                'statuses' => DriverPosition::STATUSES,
                'employmentTypes' => DriverPosition::EMPLOYMENT_TYPES,
                'routeTypes' => DriverPosition::ROUTE_TYPES,
                'payUnits' => DriverPosition::PAY_UNITS,
            ],
            'websiteUrl' => rtrim(config('services.website.url'), '/'),
        ];
    }

    private function validated(Request $request, ?DriverPosition $position = null): array
    {
        $data = $request->validate([
            'title'              => 'required|string|max:255',
            'slug'               => ['nullable', 'string', 'max:255', 'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/'],
            'status'             => ['required', Rule::in(DriverPosition::STATUSES)],
            'is_featured'        => 'boolean',
            'order'              => 'nullable|integer|min:0|max:9999',
            'summary'            => 'nullable|string|max:300',
            'content'            => 'nullable|string',
            'cover_image'        => 'nullable|image|mimes:jpg,jpeg,png,webp|max:5120',
            'remove_cover_image' => 'boolean',
            'employment_type'    => ['required', Rule::in(DriverPosition::EMPLOYMENT_TYPES)],
            'route_type'         => 'nullable|string|max:50',
            'home_time'          => 'nullable|string|max:255',
            'schedule'           => 'nullable|string|max:255',
            'equipment'          => 'nullable|string|max:255',
            'pay_min'            => 'nullable|numeric|min:0|max:99999999',
            'pay_max'            => 'nullable|numeric|min:0|max:99999999|gte:pay_min',
            'pay_unit'           => ['nullable', Rule::in(DriverPosition::PAY_UNITS)],
            'pay_display'        => 'nullable|string|max:100',
            'locations'                => 'nullable|array|max:30',
            'locations.*.city'         => 'nullable|string|max:100',
            'locations.*.state'        => 'nullable|string|max:50',
            'locations.*.postal_code'  => 'nullable|string|max:20',
            'locations.*.street'       => 'nullable|string|max:255',
            'requirements'       => 'nullable|array|max:40',
            'requirements.*'     => 'nullable|string|max:300',
            'benefits'           => 'nullable|array|max:40',
            'benefits.*'         => 'nullable|string|max:300',
            'highlights'         => 'nullable|array|max:12',
            'highlights.*.label' => 'nullable|string|max:60',
            'highlights.*.value' => 'nullable|string|max:100',
            'date_posted'        => 'nullable|date',
            'valid_through'      => 'nullable|date|after_or_equal:date_posted',
            'seo_title'          => 'nullable|string|max:255',
            'seo_description'    => 'nullable|string|max:320',
            'og_image'           => 'nullable|image|mimes:jpg,jpeg,png,webp|max:5120',
            'remove_og_image'    => 'boolean',
        ], [
            'slug.regex' => 'The URL slug may only contain lowercase letters, numbers and dashes.',
            'pay_max.gte' => 'Max pay must be greater than or equal to min pay.',
        ]);

        // Tidy list fields: drop empty rows so the website never renders blanks
        $data['locations'] = array_values(array_filter(
            array_map(fn ($l) => array_map(fn ($v) => is_string($v) ? trim($v) : $v, (array) $l), $data['locations'] ?? []),
            fn ($l) => !empty($l['city']) || !empty($l['state'])
        ));
        $data['requirements'] = array_values(array_filter(array_map('trim', array_map('strval', $data['requirements'] ?? []))));
        $data['benefits'] = array_values(array_filter(array_map('trim', array_map('strval', $data['benefits'] ?? []))));
        $data['highlights'] = array_values(array_filter(
            $data['highlights'] ?? [],
            fn ($h) => !empty($h['label']) && !empty($h['value'])
        ));
        $data['is_featured'] = (bool) ($data['is_featured'] ?? false);
        $data['order'] = (int) ($data['order'] ?? 0);

        return $data;
    }

    private function handleImages(Request $request, array $data, ?DriverPosition $position = null): array
    {
        foreach (['cover_image', 'og_image'] as $field) {
            $removeFlag = "remove_{$field}";

            if ($request->hasFile($field)) {
                if ($position?->{$field}) {
                    Storage::disk('public')->delete($position->{$field});
                }
                $data[$field] = $request->file($field)->store('uploads/drivers', 'public');
            } elseif (!empty($data[$removeFlag]) && $position?->{$field}) {
                Storage::disk('public')->delete($position->{$field});
                $data[$field] = null;
            } else {
                unset($data[$field]);
            }

            unset($data[$removeFlag]);
        }

        return $data;
    }
}
