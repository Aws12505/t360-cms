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
            'logo_image' => 'nullable|image|max:2048',
            'favicon'    => 'nullable|image|max:1024',
            'btn1_name'  => 'required|string|max:255',
            'btn1_link'  => 'required|url',
            'btn2_name'  => 'required|string|max:255',
            'btn2_link'  => 'required|url',
        ]);

        $header = HeaderSetting::instance();

        // handle file uploads
        foreach (['logo_image', 'favicon'] as $field) {
            if ($request->hasFile($field)) {
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
