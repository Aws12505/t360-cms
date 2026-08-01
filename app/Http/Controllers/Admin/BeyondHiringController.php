<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BeyondHiring;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BeyondHiringController extends Controller
{
    public function edit()
    {
        return Inertia::render('Admin/BeyondHiring/Edit', [
            'beyondHiring' => BeyondHiring::instance(),
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'hero_title'       => 'required|string|max:255',
            'hero_description' => 'required|string', // HTML from QuillEditorAdvanced
            'hero_btn_name'    => 'required|string|max:255',
            'hero_btn_link'    => 'required|string|max:255',
            'cta_title'        => 'required|string|max:255',
            'cta_description'  => 'required|string', // HTML from QuillEditorAdvanced
            'cta_btn_name'     => 'required|string|max:255',
            'cta_btn_link'     => 'required|string|max:255',
        ]);

        $beyondHiring = BeyondHiring::instance();
        $beyondHiring->update($validated);

        return redirect()
            ->route('admin.beyond-hiring.edit')
            ->with('success', 'Beyond Hiring page updated.');
    }
}
