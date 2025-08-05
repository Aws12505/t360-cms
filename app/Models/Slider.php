<?php

// app/Models/Slider.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Slider extends Model
{
    protected $fillable = [
        'title',
        'description',
        'features',
        'order',
    ];

    protected $casts = [
        'order' => 'integer',
    ];

    public function scopeOrdered($query)
    {
        return $query->orderBy('order');
    }
}
