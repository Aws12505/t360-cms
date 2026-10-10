<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class DriverPosition extends Model
{
    use SoftDeletes;

    public const STATUSES = ['draft', 'published', 'closed'];
    public const EMPLOYMENT_TYPES = ['FULL_TIME', 'PART_TIME', 'CONTRACTOR', 'TEMPORARY'];
    public const ROUTE_TYPES = ['Local', 'Regional', 'OTR', 'Dedicated'];
    // Units accepted by Google JobPosting baseSalary.unitText
    public const PAY_UNITS = ['HOUR', 'DAY', 'WEEK', 'MONTH', 'YEAR'];

    protected $fillable = [
        'title', 'slug', 'status', 'is_featured', 'order',
        'summary', 'content', 'cover_image',
        'employment_type', 'route_type', 'home_time', 'schedule', 'equipment',
        'pay_min', 'pay_max', 'pay_unit', 'pay_display', 'pay_currency',
        'locations', 'requirements', 'benefits', 'highlights',
        'date_posted', 'valid_through',
        'seo_title', 'seo_description', 'og_image',
    ];

    protected $casts = [
        'is_featured'   => 'boolean',
        'order'         => 'integer',
        'locations'     => 'array',
        'requirements'  => 'array',
        'benefits'      => 'array',
        'highlights'    => 'array',
        'date_posted'   => 'date:Y-m-d',
        'valid_through' => 'date:Y-m-d',
    ];

    protected static function booted(): void
    {
        static::saving(function (DriverPosition $position) {
            $base = Str::slug($position->slug ?: $position->title) ?: 'position';
            $position->slug = static::uniqueSlug($base, $position->id);

            if ($position->status === 'published' && !$position->date_posted) {
                $position->date_posted = now();
            }
        });
    }

    public static function uniqueSlug(string $base, ?int $ignoreId = null): string
    {
        $slug = $base;
        $i = 2;
        while (static::withTrashed()
            ->where('slug', $slug)
            ->when($ignoreId, fn ($q) => $q->where('id', '!=', $ignoreId))
            ->exists()) {
            $slug = "{$base}-{$i}";
            $i++;
        }
        return $slug;
    }

    public function scopePublished($query)
    {
        return $query->where('status', 'published')
            ->where(fn ($q) => $q->whereNull('valid_through')->orWhereDate('valid_through', '>=', now()->toDateString()));
    }

    public function scopeOrdered($query)
    {
        return $query->orderByDesc('is_featured')->orderBy('order')->orderByDesc('date_posted')->orderByDesc('id');
    }

    /**
     * Published but past its valid-through date counts as closed on the website.
     */
    public function publicStatus(): string
    {
        if ($this->status === 'published' && $this->valid_through && $this->valid_through->endOfDay()->isPast()) {
            return 'closed';
        }
        return $this->status;
    }

    public function applications()
    {
        return $this->belongsToMany(DriverApplication::class, 'driver_application_position')
            ->withPivot('position_title')
            ->withTimestamps();
    }
}
