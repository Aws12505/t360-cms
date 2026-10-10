<?php

namespace App\Mail;

use App\Models\DriverApplication;
use App\Models\HiringSetting;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class DriverApplicationConfirmationMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public DriverApplication $application, public HiringSetting $settings)
    {
    }

    public function envelope(): Envelope
    {
        $replyTo = filter_var($this->settings->reply_to, FILTER_VALIDATE_EMAIL)
            ? [new Address($this->settings->reply_to, 'Trucking 360 Hiring')]
            : [];

        return new Envelope(
            subject: HiringSetting::template(
                $this->settings->confirmation_subject ?: 'We received your application, {first_name}',
                $this->placeholders(false)
            ),
            replyTo: $replyTo,
        );
    }

    public function content(): Content
    {
        $body = $this->settings->confirmation_body
            ?: '<p>Hi {first_name},</p><p>Thanks for applying to drive with Trucking 360. Someone from our team will reach out within 2 business days.</p>';

        return new Content(
            view: 'mail.drivers.confirmation',
            with: [
                // Values are escaped; the template itself is admin-authored HTML
                'bodyHtml' => HiringSetting::template($body, $this->placeholders(true)),
            ],
        );
    }

    private function placeholders(bool $escape): array
    {
        $values = [
            'first_name' => $this->application->first_name,
            'last_name'  => $this->application->last_name,
            'positions'  => implode(', ', $this->application->positionTitles()),
        ];

        return $escape ? array_map('e', $values) : $values;
    }
}
