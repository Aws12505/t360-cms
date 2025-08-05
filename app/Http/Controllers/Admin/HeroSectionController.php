<?php

// app/Http/Controllers/Admin/HeroSectionController.php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\HeroSection;
use App\Models\HeroAnimatedText;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HeroSectionController extends Controller
{
    public function edit()
    {
        return Inertia::render('Admin/Hero/Edit', [
            'hero' => HeroSection::instance(),
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'title'        => 'required|string|max:255',
            'description'  => 'required|string',
            'image'        => 'nullable|image|max:2048',
            'animated_texts' => 'array',
            'animated_texts.*.text' => 'required|string|max:255',
        ]);

        $hero = HeroSection::instance();

        // Handle image upload
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('uploads/hero', 'public');
            $validated['image'] = $path;
        } else {
            unset($validated['image']);
        }

        // Update hero section
        $hero->update([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'image' => $validated['image'] ?? $hero->image,
        ]);

        // Update animated texts
        if (isset($validated['animated_texts'])) {
            // Delete existing texts
            $hero->animatedTexts()->delete();
            
            // Create new texts
            foreach ($validated['animated_texts'] as $index => $textData) {
                HeroAnimatedText::create([
                    'hero_section_id' => $hero->id,
                    'text' => $textData['text'],
                    'order' => $index,
                ]);
            }
        }

        return redirect()
            ->route('admin.hero.edit')
            ->with('success', 'Hero section updated.');
    }
}
