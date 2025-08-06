<?php

// app/Http/Controllers/Admin/SliderController.php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Slider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
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
            'image'       => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'order'       => 'integer|min:0',
        ]);

        // Handle image upload
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('uploads/sliders', 'public');
            $validated['image'] = $path;
        }

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
            'image'       => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'order'       => 'integer|min:0',
        ]);

        // Handle image upload
        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($slider->image) {
                Storage::disk('public')->delete($slider->image);
            }
            $path = $request->file('image')->store('uploads/sliders', 'public');
            $validated['image'] = $path;
        } else {
            unset($validated['image']);
        }

        $slider->update($validated);

        return redirect()
            ->route('admin.sliders.index')
            ->with('success', 'Slider updated successfully.');
    }

    public function destroy(Slider $slider)
    {
        // Delete image if exists
        if ($slider->image) {
            Storage::disk('public')->delete($slider->image);
        }

        $slider->delete();

        return redirect()
            ->route('admin.sliders.index')
            ->with('success', 'Slider deleted successfully.');
    }
}
