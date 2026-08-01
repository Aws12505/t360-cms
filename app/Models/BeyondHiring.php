<?php

// app/Models/BeyondHiring.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BeyondHiring extends Model
{
    protected $fillable = [
        'hero_title',
        'hero_description',
        'hero_btn_name',
        'hero_btn_link',
        'cta_title',
        'cta_description',
        'cta_btn_name',
        'cta_btn_link',
    ];

    /**
     * Get the singleton instance (always ID = 1)
     */
    public static function instance()
    {
        return static::find(1);
    }
}
