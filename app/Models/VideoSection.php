<?php

// app/Models/VideoSection.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VideoSection extends Model
{
    protected $fillable = [
        'title',
        'description',
        'video',
    ];

    /** Always fetch the singleton row */
    public static function instance(): self
    {
        return static::firstOrFail();
    }
}
