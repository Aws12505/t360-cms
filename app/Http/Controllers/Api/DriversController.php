<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Jobs\SendDriverApplicationEmails;
use App\Models\DriverApplication;
use App\Models\DriverPosition;
use App\Models\DriversPage;
use App\Models\Faq;
use App\Models\FooterSetting;
use App\Models\HiringSetting;
use App\Support\MediaUrl;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

/**
 * Public API for the website's /drivers section.
 * Unlike WebsiteController, nothing here goes through roundNumbers(): pay like 0.68/mile must stay exact.
 */
class DriversController extends Controller
{
    /**
     * GET /api/v1/drivers — landing page content, open positions and FAQs.
     */
    public function index()
    {
        $page = DriversPage::instance();
        $footer = FooterSetting::first();

        $positions = DriverPosition::published()->ordered()->get()
            ->map(fn (DriverPosition $p) => $this->card($p))
            ->values();

        $faqs = Faq::forPage('drivers')->ordered()->get()
            ->map(fn ($faq) => [
                'id' => $faq->id,
                'title' => $faq->title,
                'description' => $faq->description,
                'order' => $faq->order,
            ])->values();

        $pageData = $page ? $page->toArray() : [];
        foreach (['hero_image', 'feature_image', 'og_image'] as $key) {
            $pageData[$key] = MediaUrl::make($pageData[$key] ?? null);
        }
        $pageData['feature_body'] = MediaUrl::absolutizeHtml($pageData['feature_body'] ?? null);
        $pageData['recruiter_phone'] = ($pageData['recruiter_phone'] ?? null) ?: $footer?->phone;
        $pageData['contact_email'] = $footer?->email;
        unset($pageData['singleton'], $pageData['id']);

        return response()->json([
            'success' => true,
            'data' => [
                'page' => $pageData,
                'positions' => $positions,
                'faqs' => $faqs,
                'experience_options' => DriverApplication::EXPERIENCE_OPTIONS,
            ],
        ]);
    }

    /**
     * GET /api/v1/drivers/positions/{slug}
     * Published → full posting. Closed/expired → minimal payload so the site can show "position filled". Draft → 404.
     */
    public function show(string $slug)
    {
        $position = DriverPosition::where('slug', $slug)->first();

        if (!$position || $position->status === 'draft') {
            return response()->json(['success' => false, 'message' => 'Position not found'], 404);
        }

        $openPositions = DriverPosition::published()->ordered()->get();

        $others = $openPositions->where('id', '!=', $position->id)
            ->take(3)
            ->map(fn (DriverPosition $p) => $this->card($p))
            ->values();

        // Every open position, for the "preferred positions" picker in the application form
        $openList = $openPositions->map(fn (DriverPosition $p) => ['id' => $p->id, 'title' => $p->title])->values();

        if ($position->publicStatus() === 'closed') {
            return response()->json([
                'success' => true,
                'data' => [
                    'position' => [
                        'id' => $position->id,
                        'slug' => $position->slug,
                        'title' => $position->title,
                        'status' => 'closed',
                    ],
                    'others' => $others,
                    'open_positions' => $openList,
                ],
            ]);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'position' => array_merge($this->card($position), [
                    'content' => MediaUrl::absolutizeHtml($position->content),
                    'equipment' => $position->equipment,
                    'requirements' => array_values(array_filter($position->requirements ?? [])),
                    'benefits' => array_values(array_filter($position->benefits ?? [])),
                    'seo_title' => $position->seo_title,
                    'seo_description' => $position->seo_description,
                    'og_image' => MediaUrl::make($position->og_image),
                ]),
                'others' => $others,
                'open_positions' => $openList,
            ],
        ]);
    }

    /**
     * POST /api/v1/driver-applications — only callable by the website server (X-T360-Key).
     */
    public function apply(Request $request)
    {
        $data = $request->validate([
            'first_name'         => 'required|string|max:80',
            'last_name'          => 'required|string|max:80',
            'email'              => 'required|email|max:190',
            'phone'              => ['required', 'string', 'max:40', 'regex:/^[0-9+().\-\s]{7,40}$/'],
            'positions'          => 'nullable|array|max:20',
            'positions.*'        => 'integer',
            'availability'       => 'nullable|string|max:100',
            'has_cdl_a'          => 'boolean',
            'experience_years'   => 'nullable|in:' . implode(',', DriverApplication::EXPERIENCE_OPTIONS),
            'source_position_id' => 'nullable|integer',
            'source_url'         => 'nullable|string|max:500',
            'utm'                => 'nullable|array',
            'utm.*'              => 'nullable|string|max:150',
            'client_ip'          => 'nullable|ip',
            'user_agent'         => 'nullable|string|max:500',
        ]);

        // Only published positions can be chosen
        $positions = DriverPosition::published()
            ->whereIn('id', $data['positions'] ?? [])
            ->get(['id', 'title']);

        $sourcePositionId = isset($data['source_position_id'])
            ? DriverPosition::whereKey($data['source_position_id'])->value('id')
            : null;

        $application = DB::transaction(function () use ($data, $positions, $sourcePositionId) {
            $application = DriverApplication::create([
                'first_name'         => trim($data['first_name']),
                'last_name'          => trim($data['last_name']),
                'email'              => strtolower(trim($data['email'])),
                'phone'              => trim($data['phone']),
                'availability'       => $data['availability'] ?? null,
                'has_cdl_a'          => (bool) ($data['has_cdl_a'] ?? false),
                'experience_years'   => $data['experience_years'] ?? null,
                'status'             => 'new',
                'source_position_id' => $sourcePositionId,
                'source_url'         => $data['source_url'] ?? null,
                'utm'                => array_filter($data['utm'] ?? []) ?: null,
                'ip'                 => $data['client_ip'] ?? null,
                'user_agent'         => $data['user_agent'] ?? null,
            ]);

            foreach ($positions as $position) {
                $application->positionRows()->create([
                    'driver_position_id' => $position->id,
                    'position_title'     => $position->title,
                ]);
            }

            return $application;
        });

        // Send after the HTTP response so the driver isn't kept waiting, and no queue worker is required
        SendDriverApplicationEmails::dispatchAfterResponse($application->id);

        $page = DriversPage::instance();
        $message = HiringSetting::template(
            $page?->success_message ?: 'Thanks, {first_name}! Someone from our team will reach out within 2 business days.',
            ['first_name' => e($application->first_name)]
        );

        return response()->json([
            'success' => true,
            'message' => $message,
        ], 201);
    }

    private function card(DriverPosition $p): array
    {
        return [
            'id'              => $p->id,
            'slug'            => $p->slug,
            'title'           => $p->title,
            'status'          => $p->publicStatus(),
            'summary'         => $p->summary,
            'is_featured'     => $p->is_featured,
            'cover_image'     => MediaUrl::make($p->cover_image),
            'employment_type' => $p->employment_type,
            'route_type'      => $p->route_type,
            'home_time'       => $p->home_time,
            'schedule'        => $p->schedule,
            'pay_min'         => $p->pay_min !== null ? (float) $p->pay_min : null,
            'pay_max'         => $p->pay_max !== null ? (float) $p->pay_max : null,
            'pay_unit'        => $p->pay_unit,
            'pay_display'     => $p->pay_display,
            'pay_currency'    => $p->pay_currency ?: 'USD',
            'locations'       => array_values(array_filter($p->locations ?? [], fn ($l) => !empty($l['city']) || !empty($l['state']))),
            'highlights'      => array_values(array_filter($p->highlights ?? [], fn ($h) => !empty($h['label']) && !empty($h['value']))),
            'date_posted'     => $p->date_posted?->toDateString(),
            'valid_through'   => $p->valid_through?->toDateString(),
            'updated_at'      => $p->updated_at?->toIso8601String(),
        ];
    }
}
