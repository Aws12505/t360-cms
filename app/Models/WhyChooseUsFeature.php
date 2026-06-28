<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class WhyChooseUsFeature extends Model
{
    protected $fillable = [
        'title',
        'description',
        'icon',
        'order',
    ];

    protected $casts = [
        'order' => 'integer',
    ];

    protected $appends = [
        'icon_url',
    ];

    public function scopeOrdered($query)
    {
        return $query->orderBy('order');
    }

    public function getIconUrlAttribute()
    {
        return $this->icon ? Storage::url($this->icon) : null;
    }
}
