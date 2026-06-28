<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\WhyChooseUs;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WhyChooseUsController extends Controller
{
    public function edit()
    {
        return Inertia::render('Admin/WhyChooseUs/Edit', [
            'whyChooseUs' => WhyChooseUs::instance(),
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'title'       => 'required|string|max:255',
            'subtitle'    => 'required|string|max:255',
            'description' => 'required|string',
        ]);

        $whyChooseUs = WhyChooseUs::instance();
        $whyChooseUs->update($validated);

        return redirect()
            ->route('admin.why-choose-us.edit')
            ->with('success', 'Why Choose Us section updated.');
    }
}
