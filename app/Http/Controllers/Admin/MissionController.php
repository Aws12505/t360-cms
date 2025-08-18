<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Mission;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MissionController extends Controller
{
    public function edit()
    {
        return Inertia::render('Admin/Mission/Edit', [
            'mission' => Mission::instance(),
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'text' => 'required|string',
        ]);

        $mission = Mission::instance();

        // Update mission
        $mission->update([
            'text' => $validated['text'],
        ]);

        return redirect()
            ->route('admin.mission.edit')
            ->with('success', 'Mission updated successfully.');
    }
}
