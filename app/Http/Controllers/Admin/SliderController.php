<?php

// app/Http/Controllers/Admin/SliderController.php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Slider;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SliderController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Sliders/Index', [
            'sliders' => Slider::ordered()->get(),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Sliders/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'nullable|string',
            'features'    => 'nullable|string',
            'order'       => 'integer|min:0',
        ]);

        Slider::create($validated);

        return redirect()
            ->route('admin.sliders.index')
            ->with('success', 'Slider created successfully.');
    }

    public function edit(Slider $slider)
    {
        return Inertia::render('Admin/Sliders/Edit', [
            'slider' => $slider,
        ]);
    }

    public function update(Request $request, Slider $slider)
    {
        $validated = $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'nullable|string',
            'features'    => 'nullable|string',
            'order'       => 'integer|min:0',
        ]);

        $slider->update($validated);

        return redirect()
            ->route('admin.sliders.index')
            ->with('success', 'Slider updated successfully.');
    }

    public function destroy(Slider $slider)
    {
        $slider->delete();

        return redirect()
            ->route('admin.sliders.index')
            ->with('success', 'Slider deleted successfully.');
    }
}
