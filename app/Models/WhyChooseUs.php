<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WhyChooseUs extends Model
{
    protected $table = 'why_choose_us';

    protected $fillable = [
        'title',
        'subtitle',
        'description',
    ];

    /**
     * Get the singleton instance (always ID = 1)
     */
    public static function instance()
    {
        return static::find(1);
    }
}
