<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DriversPage extends Model
{
    protected $fillable = [
        'hero_eyebrow', 'hero_title', 'hero_subtitle', 'hero_image',
        'hero_primary_btn', 'hero_secondary_btn', 'recruiter_phone', 'trust_chips',
        'positions_title', 'positions_subtitle', 'empty_state',
        'accept_general_applications', 'closed_message',
        'why_title', 'why_subtitle', 'why_items',
        'feature_title', 'feature_body', 'feature_image',
        'steps_title', 'steps',
        'form_title', 'form_subtitle', 'availability_options', 'success_message',
        'cta_title', 'cta_body',
        'seo_title', 'seo_description', 'og_image',
    ];

    protected $casts = [
        'accept_general_applications' => 'boolean',
        'trust_chips'          => 'array',
        'why_items'            => 'array',
        'steps'                => 'array',
        'availability_options' => 'array',
    ];

    /**
     * Get the singleton instance (always ID = 1)
     */
    public static function instance()
    {
        return static::find(1);
    }

    /**
     * Applications are accepted while any position is open, or when general
     * applications are switched on for times with no openings.
     */
    public static function acceptingApplications(): bool
    {
        if (DriverPosition::published()->exists()) {
            return true;
        }

        return (bool) (static::instance()?->accept_general_applications ?? true);
    }
}
