<?php

// app/Models/Faq.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Faq extends Model
{
    protected $fillable = [
        'title',
        'description',
        'page',
        'order',
    ];

    protected $casts = [
        'order' => 'integer',
    ];

    public function scopeOrdered($query)
    {
        return $query->orderBy('order');
    }

    public function scopeForPage($query, $page)
    {
        return $query->where('page', $page);
    }
}
