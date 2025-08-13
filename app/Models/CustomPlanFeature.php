<?php

// app/Models/CustomPlanFeature.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CustomPlanFeature extends Model
{
    protected $fillable = [
        'name',
        'price',
    ];

    protected $casts = [
        'price' => 'decimal:2',
    ];
    public function plans()
    {
        return $this->belongsToMany(PricingPlan::class,'custom_feature_pricing_plan')
                    ->withTimestamps();
    }
}
