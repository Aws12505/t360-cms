<?php

// app/Http/Controllers/Admin/VideoSectionController.php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\VideoSection;
use Illuminate\Http\Request;
use Inertia\Inertia;

class VideoSectionController extends Controller
{
    public function edit()
    {
        return Inertia::render('Admin/Video/Edit', [
            'video' => VideoSection::instance(),
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'required|string',
            'video'       => 'nullable|file|mimes:mp4,avi,mov,wmv|max:51200', // 50MB max
        ]);

        $videoSection = VideoSection::instance();

        // Handle video upload
        if ($request->hasFile('video')) {
            $path = $request->file('video')->store('uploads/videos', 'public');
            $validated['video'] = $path;
        } else {
            unset($validated['video']);
        }

        $videoSection->update($validated);

        return redirect()
            ->route('admin.video.edit')
            ->with('success', 'Video section updated.');
    }
}
