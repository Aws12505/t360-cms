<?php

// app/Models/HeroSection.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class HeroSection extends Model
{
    protected $fillable = [
        'title',
        'description',
        'image',
    ];

    public function animatedTexts(): HasMany
    {
        return $this->hasMany(HeroAnimatedText::class)->orderBy('order');
    }

    /** Always fetch the singleton row */
    public static function instance(): self
    {
        return static::with('animatedTexts')->firstOrFail();
    }
}
