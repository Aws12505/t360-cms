<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Mission extends Model
{
    protected $fillable = [
        'text',
    ];

    /**
     * Get the singleton instance (always ID = 1)
     */
    public static function instance()
    {
        return static::find(1);
    }
}
