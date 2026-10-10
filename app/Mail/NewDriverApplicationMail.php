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

class NewDriverApplicationMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public DriverApplication $application, public HiringSetting $settings)
    {
    }

    public function envelope(): Envelope
    {
        $subject = HiringSetting::template(
            $this->settings->admin_subject ?: 'New driver application: {first_name} {last_name}',
            $this->placeholders()
        );

        return new Envelope(
            subject: $subject,
            replyTo: [new Address($this->application->email, $this->application->full_name)],
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'mail.drivers.new-application',
            with: [
                'application' => $this->application,
                'positions'   => $this->application->positionTitles(),
                'adminUrl'    => route('admin.driver-applications.show', $this->application->id),
            ],
        );
    }

    private function placeholders(): array
    {
        return [
            'first_name' => $this->application->first_name,
            'last_name'  => $this->application->last_name,
            'positions'  => implode(', ', $this->application->positionTitles()),
        ];
    }
}
