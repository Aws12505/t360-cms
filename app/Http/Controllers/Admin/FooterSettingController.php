<?php

// app/Http/Controllers/Admin/FooterSettingController.php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\FooterSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FooterSettingController extends Controller
{
    public function edit()
    {
        return Inertia::render('Admin/Footer/Edit', [
            'footer' => FooterSetting::instance(),
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'title'        => 'required|string|max:255',
            'description'  => 'required|string',
            'location'     => 'required|string|max:255',
            'phone'        => 'required|string|max:255',
            'email'        => 'required|email|max:255',
            'linkedin_url' => 'nullable|url',
            'facebook_url' => 'nullable|url',
        ]);

        FooterSetting::instance()->update($validated);

        return redirect()
            ->route('admin.footer.edit')
            ->with('success', 'Footer settings updated.');
    }
}
