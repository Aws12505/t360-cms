<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class DriverApplication extends Model
{
    use SoftDeletes;

    public const STATUSES = ['new', 'contacted', 'hired', 'not_a_fit'];
    public const STATUS_LABELS = [
        'new'       => 'New',
        'contacted' => 'Contacted',
        'hired'     => 'Hired',
        'not_a_fit' => 'Not a fit',
    ];
    public const EXPERIENCE_OPTIONS = ['<1', '1-2', '3-5', '5+'];

    protected $fillable = [
        'first_name', 'last_name', 'email', 'phone',
        'availability', 'has_cdl_a', 'experience_years',
        'status', 'read_at',
        'source_position_id', 'source_url', 'utm', 'ip', 'user_agent',
    ];

    protected $casts = [
        'has_cdl_a' => 'boolean',
        'utm'       => 'array',
        'read_at'   => 'datetime',
    ];

    protected $appends = ['full_name'];

    public function getFullNameAttribute(): string
    {
        return trim("{$this->first_name} {$this->last_name}");
    }

    public function positions()
    {
        return $this->belongsToMany(DriverPosition::class, 'driver_application_position')
            ->withPivot('position_title')
            ->withTimestamps();
    }

    /**
     * Pivot rows including ones whose position was deleted (title snapshot kept).
     */
    public function positionRows()
    {
        return $this->hasMany(DriverApplicationPosition::class);
    }

    public function sourcePosition()
    {
        return $this->belongsTo(DriverPosition::class, 'source_position_id')->withTrashed();
    }

    public function notes()
    {
        return $this->hasMany(DriverApplicationNote::class)->latest();
    }

    public function positionTitles(): array
    {
        $titles = $this->positionRows->pluck('position_title')->filter()->values()->all();
        return $titles ?: ['Open to any position'];
    }

    public function log(string $type, string $body, ?int $userId = null, array $meta = []): DriverApplicationNote
    {
        return $this->notes()->create([
            'type'    => $type,
            'body'    => $body,
            'user_id' => $userId,
            'meta'    => $meta ?: null,
        ]);
    }
}
