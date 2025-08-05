<?php

/* app/Models/PricingBooking.php */
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PricingBooking extends Model
{
    protected $fillable = [
        'title', 'description', 'btn_name', 'btn_link',
    ];

    /** Always fetch the singleton row */
    public static function instance(): self
    {
        return static::firstOrFail();
    }
}
