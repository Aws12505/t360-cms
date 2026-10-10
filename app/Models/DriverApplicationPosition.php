<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DriverApplicationPosition extends Model
{
    protected $table = 'driver_application_position';

    protected $fillable = ['driver_application_id', 'driver_position_id', 'position_title'];

    public function position()
    {
        return $this->belongsTo(DriverPosition::class, 'driver_position_id')->withTrashed();
    }
}
