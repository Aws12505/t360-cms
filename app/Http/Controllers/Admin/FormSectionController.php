<?php

// app/Http/Controllers/Admin/FormSectionController.php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\FormSection;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FormSectionController extends Controller
{
    public function edit()
    {
        return Inertia::render('Admin/FormSection/Edit', [
            'formSection' => FormSection::instance(),
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'required|string',
        ]);

        FormSection::instance()->update($validated);

        return redirect()
            ->route('admin.form-section.edit')
            ->with('success', 'Form section updated.');
    }
}
