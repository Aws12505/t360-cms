<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Dashboard360 extends Model
{
    protected $fillable = [
        'title',
        'description',
        'video',
        'btn_text',
        'btn_link',
    ];

    public static function instance()
    {
        return static::find(1);
    }
}
