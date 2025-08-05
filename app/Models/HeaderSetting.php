<?php

// app/Models/HeaderSetting.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HeaderSetting extends Model
{
    public $timestamps = true;

    protected $fillable = [
        'logo_image',
        'favicon',
        'btn1_name',
        'btn1_link',
        'btn2_name',
        'btn2_link',
    ];

    // Force Eloquent to use the single row (ID = 1)
    public static function instance(): self
    {
        return static::firstOrFail();
    }
}
