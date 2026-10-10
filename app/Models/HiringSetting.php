<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HiringSetting extends Model
{
    protected $fillable = [
        'notify_enabled', 'notification_emails', 'admin_subject',
        'confirmation_enabled', 'confirmation_subject', 'confirmation_body', 'reply_to',
    ];

    protected $casts = [
        'notify_enabled'       => 'boolean',
        'confirmation_enabled' => 'boolean',
        'notification_emails'  => 'array',
    ];

    /**
     * Get the singleton instance (always ID = 1)
     */
    public static function instance()
    {
        return static::find(1);
    }

    /**
     * Replace {placeholders} with application values.
     */
    public static function template(?string $template, array $values): string
    {
        $search = array_map(fn ($k) => '{' . $k . '}', array_keys($values));
        return str_replace($search, array_values($values), (string) $template);
    }
}
