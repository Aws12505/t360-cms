<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\WhyChooseUsFeature;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class WhyChooseUsFeatureController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/WhyChooseUsFeatures/Index', [
            'features' => WhyChooseUsFeature::ordered()->get(),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/WhyChooseUsFeatures/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'required|string',
            'icon'        => 'nullable|file|mimes:jpeg,png,jpg,gif,webp,svg|max:2048',
            'order'       => 'integer|min:0',
        ]);

        if ($request->hasFile('icon')) {
            $path = $request->file('icon')->store('uploads/why-choose-us', 'public');
            $validated['icon'] = $path;
        }

        WhyChooseUsFeature::create($validated);

        return redirect()
            ->route('admin.why-choose-us-features.index')
            ->with('success', 'Feature created successfully.');
    }

    public function edit(WhyChooseUsFeature $whyChooseUsFeature)
    {
        return Inertia::render('Admin/WhyChooseUsFeatures/Edit', [
            'feature' => $whyChooseUsFeature,
        ]);
    }

    public function update(Request $request, WhyChooseUsFeature $whyChooseUsFeature)
    {
        $validated = $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'required|string',
            'icon'        => 'nullable|file|mimes:jpeg,png,jpg,gif,webp,svg|max:2048',
            'order'       => 'integer|min:0',
        ]);

        if ($request->hasFile('icon')) {
            // Delete old icon if exists
            if ($whyChooseUsFeature->icon) {
                Storage::disk('public')->delete($whyChooseUsFeature->icon);
            }
            $path = $request->file('icon')->store('uploads/why-choose-us', 'public');
            $validated['icon'] = $path;
        } else {
            unset($validated['icon']);
        }

        $whyChooseUsFeature->update($validated);

        return redirect()
            ->route('admin.why-choose-us-features.index')
            ->with('success', 'Feature updated successfully.');
    }

    public function destroy(WhyChooseUsFeature $whyChooseUsFeature)
    {
        if ($whyChooseUsFeature->icon) {
            Storage::disk('public')->delete($whyChooseUsFeature->icon);
        }

        $whyChooseUsFeature->delete();

        return redirect()
            ->route('admin.why-choose-us-features.index')
            ->with('success', 'Feature deleted successfully.');
    }
}
