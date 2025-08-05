<?php

/* app/Models/PricingTable.php */
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PricingTable extends Model
{
    protected $fillable = ['title'];

    public function contents(): HasMany
    {
        return $this->hasMany(PricingTableContent::class)
                    ->orderBy('id');
    }
}
