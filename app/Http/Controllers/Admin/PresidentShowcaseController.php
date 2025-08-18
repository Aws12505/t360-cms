<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PresidentShowcase;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PresidentShowcaseController extends Controller
{
    public function edit()
    {
        return Inertia::render('Admin/PresidentShowcase/Edit', [
            'president' => PresidentShowcase::instance(),
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'name'        => 'required|string|max:255',
            'role'        => 'required|string|max:255',
            'description' => 'required|string', // this is HTML from Quill
            'image'       => 'nullable|image|max:5120',
        ]);

        $president = PresidentShowcase::instance();

        // Handle image upload
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('uploads/president', 'public');
            $validated['image'] = $path;
        } else {
            unset($validated['image']);
        }

        $president->update([
            'name'        => $validated['name'],
            'role'        => $validated['role'],
            'description' => $validated['description'],
            'image'       => $validated['image'] ?? $president->image,
        ]);

        return redirect()
            ->route('admin.president-showcase.edit')
            ->with('success', 'President information updated.');
    }
}
