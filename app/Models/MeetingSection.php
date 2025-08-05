<?php

// app/Models/MeetingSection.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MeetingSection extends Model
{
    protected $fillable = [
        'title',
        'description',
        'btn_name',
        'btn_link',
        'image',
    ];

    /** Always fetch the singleton row */
    public static function instance(): self
    {
        return static::firstOrFail();
    }
}
