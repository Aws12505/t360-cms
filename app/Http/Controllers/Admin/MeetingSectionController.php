<?php

// app/Http/Controllers/Admin/MeetingSectionController.php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MeetingSection;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MeetingSectionController extends Controller
{
    public function edit()
    {
        return Inertia::render('Admin/Meeting/Edit', [
            'meeting' => MeetingSection::instance(),
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'required|string',
            'btn_name'    => 'required|string|max:255',
            'btn_link'    => 'required|url',
            'image'       => 'nullable|image|max:2048',
        ]);

        $meeting = MeetingSection::instance();

        // Handle image upload
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('uploads/meeting', 'public');
            $validated['image'] = $path;
        } else {
            unset($validated['image']);
        }

        $meeting->update($validated);

        return redirect()
            ->route('admin.meeting.edit')
            ->with('success', 'Meeting section updated.');
    }
}
