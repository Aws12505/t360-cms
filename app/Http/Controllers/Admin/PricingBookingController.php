<?php

/* app/Http/Controllers/Admin/PricingBookingController.php */
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PricingBooking;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PricingBookingController extends Controller
{
    public function edit()
    {
        return Inertia::render('Admin/PricingBooking/Edit', [
            'booking' => PricingBooking::instance(),
        ]);
    }

    public function update(Request $request)
    {
        $data = $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'required|string',
            'btn_name'    => 'required|string|max:255',
            'btn_link'    => 'required|url',
        ]);

        PricingBooking::instance()->update($data);

        return back()->with('success', 'Pricing booking updated.');
    }
}
