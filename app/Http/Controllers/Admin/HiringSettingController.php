<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Mail\DriverApplicationConfirmationMail;
use App\Mail\NewDriverApplicationMail;
use App\Models\DriverApplication;
use App\Models\HiringSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class HiringSettingController extends Controller
{
    public function edit(Request $request)
    {
        return Inertia::render('Admin/Drivers/Settings/Edit', [
            'settings' => HiringSetting::instance(),
            'mailer' => config('mail.default'),
            'fromAddress' => config('mail.from.address'),
            'userEmail' => $request->user()?->email,
        ]);
    }

    public function update(Request $request)
    {
        $data = $request->validate([
            'notify_enabled'        => 'boolean',
            'notification_emails'   => 'nullable|array|max:10|required_if_accepted:notify_enabled',
            'notification_emails.*' => 'required|email|max:190|distinct',
            'admin_subject'         => 'nullable|string|max:200',
            'confirmation_enabled'  => 'boolean',
            'confirmation_subject'  => 'nullable|string|max:200',
            'confirmation_body'     => 'nullable|string|max:20000',
            'reply_to'              => 'nullable|email|max:190',
        ], [
            'notification_emails.required_if_accepted' => 'Add at least one email to receive new-application notifications.',
            'notification_emails.*.email' => 'Each notification recipient must be a valid email address.',
        ]);

        $data['notification_emails'] = array_values($data['notification_emails'] ?? []);

        HiringSetting::instance()->update($data);

        return redirect()
            ->route('admin.hiring-settings.edit')
            ->with('success', 'Hiring settings updated.');
    }

    /**
     * Send both emails to one address with sample data, so the team can check templates and mail delivery.
     */
    public function test(Request $request)
    {
        $data = $request->validate(['email' => 'required|email']);

        $sample = new DriverApplication([
            'first_name' => 'Jordan',
            'last_name' => 'Sample',
            'email' => $data['email'],
            'phone' => '(555) 010-2030',
            'availability' => 'Within 2 weeks',
            'has_cdl_a' => true,
            'experience_years' => '3-5',
        ]);
        $sample->id = 0;
        $sample->created_at = now();
        $sample->setRelation('positionRows', collect([
            (object) ['position_title' => 'Regional CDL-A Driver (sample)'],
        ]));

        $settings = HiringSetting::instance();

        try {
            Mail::to($data['email'])->send(new NewDriverApplicationMail($sample, $settings));
            Mail::to($data['email'])->send(new DriverApplicationConfirmationMail($sample, $settings));
        } catch (\Throwable $e) {
            return back()->with('error', 'Sending failed: ' . $e->getMessage());
        }

        $note = config('mail.default') === 'log'
            ? ' (mailer is set to "log": the emails were written to storage/logs/laravel.log, not delivered)'
            : '';

        return back()->with('success', "Test emails sent to {$data['email']}{$note}.");
    }
}
