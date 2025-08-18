<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PresidentShowcase extends Model
{
    protected $fillable = [
        'name',
        'role',
        'description',
        'image',
    ];

    public static function instance()
    {
        return static::find(1);
    }
}
