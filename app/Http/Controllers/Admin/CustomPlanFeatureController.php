<?php

// app/Http/Controllers/Admin/CustomPlanFeatureController.php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CustomPlanFeature;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CustomPlanFeatureController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/CustomFeatures/Index', [
            'features' => CustomPlanFeature::orderBy('name')->get(),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/CustomFeatures/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'  => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
        ]);

        CustomPlanFeature::create($validated);

        return redirect()
            ->route('admin.custom-features.index')
            ->with('success', 'Custom feature created successfully.');
    }

    public function edit(CustomPlanFeature $customFeature)
    {
        return Inertia::render('Admin/CustomFeatures/Edit', [
            'feature' => $customFeature,
        ]);
    }

    public function update(Request $request, CustomPlanFeature $customFeature)
    {
        $validated = $request->validate([
            'name'  => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
        ]);

        $customFeature->update($validated);

        return redirect()
            ->route('admin.custom-features.index')
            ->with('success', 'Custom feature updated successfully.');
    }

    public function destroy(CustomPlanFeature $customFeature)
    {
        $customFeature->delete();

        return redirect()
            ->route('admin.custom-features.index')
            ->with('success', 'Custom feature deleted successfully.');
    }
}
