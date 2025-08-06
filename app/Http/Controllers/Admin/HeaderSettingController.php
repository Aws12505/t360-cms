<?php

// app/Http/Controllers/Admin/HeaderSettingController.php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\HeaderSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class HeaderSettingController extends Controller
{
    public function edit()
    {
        $header= HeaderSetting::instance();
        return Inertia::render('Admin/Header/Edit', [
            'header' => $header,
        ]);
    }

    public function update(Request $request)
{
    $validated = $request->validate([
        'logo_image' => 'nullable|mimes:jpeg,png,jpg,gif,svg,ico|max:10240',
        'favicon'    => 'nullable|image|max:1024',
        'btn1_name'  => 'required|string|max:255',
        'btn1_link'  => 'required|string',
        'btn2_name'  => 'required|string|max:255',
        'btn2_link'  => 'required|string',
    ]);

    $header = HeaderSetting::instance();

    // Handle file uploads and delete old files
    foreach (['logo_image', 'favicon'] as $field) {
        if ($request->hasFile($field)) {
            // Delete old file if it exists
            if (!empty($header->$field) && Storage::disk('public')->exists($header->$field)) {
                Storage::disk('public')->delete($header->$field);
            }

            // Store new file
            $path = $request->file($field)->store("uploads/header", 'public');
            $validated[$field] = $path;
        } else {
            unset($validated[$field]);
        }
    }

    $header->update($validated);

    return redirect()
        ->route('admin.header.edit')
        ->with('success', 'Header settings updated successfully.');
}
}
