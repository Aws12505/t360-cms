<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Article extends Model
{
    protected $fillable = [
        'title',
        'description',
        'featured_image',
        'custom_date',
        'content',
        'is_active'
    ];

    protected $casts = [
        'custom_date' => 'date',
        'is_active' => 'boolean'
    ];

    public function images(): HasMany
    {
        return $this->hasMany(ArticleImage::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeInactive($query)
    {
        return $query->where('is_active', false);
    }
}
