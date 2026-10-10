<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\DriversPage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class DriversPageController extends Controller
{
    private const IMAGES = ['hero_image', 'feature_image', 'og_image'];

    public function edit()
    {
        $page = DriversPage::instance();
        $data = $page?->toArray() ?? [];

        foreach (self::IMAGES as $field) {
            $data["{$field}_url"] = !empty($data[$field]) ? Storage::url($data[$field]) : null;
        }

        return Inertia::render('Admin/Drivers/Page/Edit', [
            'page' => $data,
            'websiteUrl' => rtrim(config('services.website.url'), '/'),
        ]);
    }

    public function update(Request $request)
    {
        $data = $request->validate([
            'hero_title'         => 'required|string|max:160',
            'hero_subtitle'      => 'nullable|string|max:600',
            'hero_primary_btn'   => 'nullable|string|max:60',
            'hero_secondary_btn' => 'nullable|string|max:60',
            'recruiter_phone'    => 'nullable|string|max:40',
            'trust_chips'        => 'nullable|array|max:6',
            'trust_chips.*'      => 'nullable|string|max:60',

            'positions_title'    => 'nullable|string|max:160',
            'positions_subtitle' => 'nullable|string|max:600',
            'empty_state'        => 'nullable|string|max:1000',
            'accept_general_applications' => 'boolean',
            'closed_message'     => 'nullable|string|max:1000',

            'why_title'          => 'nullable|string|max:160',
            'why_subtitle'       => 'nullable|string|max:600',
            'why_items'          => 'nullable|array|max:8',
            'why_items.*.icon'   => 'nullable|string|max:30',
            'why_items.*.title'  => 'nullable|string|max:80',
            'why_items.*.description' => 'nullable|string|max:400',

            'feature_title'      => 'nullable|string|max:160',
            'feature_body'       => 'nullable|string',

            'steps_title'        => 'nullable|string|max:160',
            'steps'              => 'nullable|array|max:6',
            'steps.*.title'      => 'nullable|string|max:80',
            'steps.*.description' => 'nullable|string|max:400',

            'form_title'         => 'nullable|string|max:160',
            'form_subtitle'      => 'nullable|string|max:600',
            'availability_options'   => 'nullable|array|max:10',
            'availability_options.*' => 'nullable|string|max:60',
            'success_message'    => 'nullable|string|max:600',

            'cta_title'          => 'nullable|string|max:160',
            'cta_body'           => 'nullable|string|max:600',

            'seo_title'          => 'nullable|string|max:255',
            'seo_description'    => 'nullable|string|max:320',

            'hero_image'           => 'nullable|image|mimes:jpg,jpeg,png,webp|max:6144',
            'feature_image'        => 'nullable|image|mimes:jpg,jpeg,png,webp|max:6144',
            'og_image'             => 'nullable|image|mimes:jpg,jpeg,png,webp|max:6144',
            'remove_hero_image'    => 'boolean',
            'remove_feature_image' => 'boolean',
            'remove_og_image'      => 'boolean',
        ]);

        $page = DriversPage::instance();

        // Drop empty list rows
        $data['trust_chips'] = array_values(array_filter(array_map('trim', array_map('strval', $data['trust_chips'] ?? []))));
        $data['availability_options'] = array_values(array_filter(array_map('trim', array_map('strval', $data['availability_options'] ?? []))));
        $data['why_items'] = array_values(array_filter($data['why_items'] ?? [], fn ($i) => !empty($i['title'])));
        $data['steps'] = array_values(array_filter($data['steps'] ?? [], fn ($s) => !empty($s['title'])));

        foreach (self::IMAGES as $field) {
            $removeFlag = "remove_{$field}";
            if ($request->hasFile($field)) {
                if ($page->{$field}) {
                    Storage::disk('public')->delete($page->{$field});
                }
                $data[$field] = $request->file($field)->store('uploads/drivers', 'public');
            } elseif (!empty($data[$removeFlag]) && $page->{$field}) {
                Storage::disk('public')->delete($page->{$field});
                $data[$field] = null;
            } else {
                unset($data[$field]);
            }
            unset($data[$removeFlag]);
        }

        $page->update($data);

        return redirect()
            ->route('admin.drivers-page.edit')
            ->with('success', 'Drivers page updated.');
    }
}
