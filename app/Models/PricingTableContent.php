<?php

/* app/Models/PricingTableContent.php */
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PricingTableContent extends Model
{
    protected $fillable = [
        'pricing_table_id',
        'service_name',
        'description',
        'is_safety',
    ];

    protected $casts = ['is_safety' => 'boolean'];

    public function table(): BelongsTo
    {
        return $this->belongsTo(PricingTable::class, 'pricing_table_id');
    }
}
