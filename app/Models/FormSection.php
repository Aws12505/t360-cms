<?php

// app/Models/FormSection.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FormSection extends Model
{
    protected $fillable = [
        'title',
        'description',
    ];

    /** Always fetch the singleton row */
    public static function instance(): self
    {
        return static::firstOrFail();
    }
}
