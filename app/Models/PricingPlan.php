<?php

// app/Models/PricingPlan.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PricingPlan extends Model
{
    protected $fillable = [
        'name',
        'total_value',
        'per_text',
        'description',
        'features',
        'is_customizable',
        'is_best_value',
        'order',
    ];

    protected $casts = [
        'total_value' => 'decimal:2',
        'is_customizable' => 'boolean',
        'is_best_value' => 'boolean',
        'order' => 'integer',

    ];

    public function scopeBestValue($query)
    {
        return $query->where('is_best_value', true);
    }

    public function scopeCustomizable($query)
    {
        return $query->where('is_customizable', true);
    }
    public function scopeOrdered($query)
    {
        return $query->orderBy('order');
    }
    public function scopeFixed($query)
    {
        return $query->where('is_customizable', false);
    }
    public function customFeatures()
    {
        return $this->belongsToMany(CustomPlanFeature::class)
                    ->withTimestamps()
                    ->orderBy('name');
    }
}
