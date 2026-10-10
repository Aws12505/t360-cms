<?php

namespace App\Jobs;

use App\Mail\DriverApplicationConfirmationMail;
use App\Mail\NewDriverApplicationMail;
use App\Models\DriverApplication;
use App\Models\HiringSetting;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

/**
 * Sends the team notification and the applicant confirmation for a new application.
 * Dispatched with dispatchAfterResponse(), so it runs right after the API response without a queue worker.
 */
class SendDriverApplicationEmails implements ShouldQueue
{
    use Dispatchable, Queueable;

    public function __construct(public int $applicationId)
    {
    }

    public function handle(): void
    {
        $application = DriverApplication::with('positionRows')->find($this->applicationId);
        $settings = HiringSetting::instance();

        if (!$application || !$settings) {
            return;
        }

        $recipients = collect($settings->notification_emails ?? [])
            ->map(fn ($e) => trim((string) $e))
            ->filter(fn ($e) => filter_var($e, FILTER_VALIDATE_EMAIL))
            ->unique()->values()->all();

        if ($settings->notify_enabled && $recipients) {
            try {
                Mail::to($recipients)->send(new NewDriverApplicationMail($application, $settings));
                $application->log('email', 'New application notification sent to ' . implode(', ', $recipients));
            } catch (\Throwable $e) {
                Log::error('Driver application notification failed: ' . $e->getMessage());
                $application->log('email', 'Failed to send team notification: ' . $e->getMessage());
            }
        }

        if ($settings->confirmation_enabled) {
            try {
                Mail::to($application->email)->send(new DriverApplicationConfirmationMail($application, $settings));
                $application->log('email', "Confirmation email sent to {$application->email}");
            } catch (\Throwable $e) {
                Log::error('Driver application confirmation failed: ' . $e->getMessage());
                $application->log('email', 'Failed to send confirmation email: ' . $e->getMessage());
            }
        }
    }
}
