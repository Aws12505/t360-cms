<?php

// app/Models/FooterSetting.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FooterSetting extends Model
{
    protected $fillable = [
        'title',
        'description',
        'location',
        'phone',
        'email',
        'linkedin_url',
        'facebook_url',
    ];

    /** Always fetch the singleton row */
    public static function instance(): self
    {
        return static::firstOrFail();
    }
}
