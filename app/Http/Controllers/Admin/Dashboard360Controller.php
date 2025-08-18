<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Dashboard360;
use Illuminate\Http\Request;
use Inertia\Inertia;

class Dashboard360Controller extends Controller
{
    public function edit()
    {
        return Inertia::render('Admin/Dashboard360/Edit', [
            'dashboard360' => Dashboard360::instance(),
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string', // HTML from QuillEditor
            'video' => 'nullable|file|mimetypes:video/mp4,video/quicktime,video/webm|max:102400', // ~100MB
            'btn_text' => 'nullable|string|max:255',
            'btn_link' => 'nullable|string|max:255',
        ]);

        $dashboard360 = Dashboard360::instance();

        // Handle video upload
        if ($request->hasFile('video')) {
            $path = $request->file('video')->store('uploads/dashboard360', 'public');
            $validated['video'] = $path;
        } else {
            unset($validated['video']);
        }

        $dashboard360->update([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'video' => $validated['video'] ?? $dashboard360->video,
            'btn_text' => $validated['btn_text'],
            'btn_link' => $validated['btn_link'],
        ]);

        return redirect()
            ->route('admin.dashboard360.edit')
            ->with('success', 'Dashboard360 updated.');
    }
}
