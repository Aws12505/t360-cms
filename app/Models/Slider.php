<?php

// app/Models/Slider.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Slider extends Model
{
    protected $fillable = [
        'title',
        'description',
        'features',
        'image',
        'order',
    ];

    protected $casts = [
        'order' => 'integer',
    ];

    public function scopeOrdered($query)
    {
        return $query->orderBy('order');
    }
     public function getImageUrlAttribute()
    {
        return $this->image ? Storage::url($this->image) : null;
    }
}
