<?php

// app/Models/HeroAnimatedText.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HeroAnimatedText extends Model
{
    protected $fillable = [
        'hero_section_id',
        'text',
        'order',
    ];

    public function heroSection(): BelongsTo
    {
        return $this->belongsTo(HeroSection::class);
    }
}
