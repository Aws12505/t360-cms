<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DriverApplicationNote extends Model
{
    protected $fillable = ['driver_application_id', 'user_id', 'type', 'body', 'meta'];

    protected $casts = [
        'meta' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function application()
    {
        return $this->belongsTo(DriverApplication::class, 'driver_application_id');
    }
}
