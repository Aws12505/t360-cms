@component('mail.drivers.layout', ['title' => 'New driver application', 'tagline' => 'New driver application'])
    <h1 style="font-size:22px;margin:0 0 6px;color:#141a4d;">{{ $application->full_name }}</h1>
    <p style="margin:0 0 20px;color:#5b6081;">applied {{ $application->created_at->timezone(config('app.timezone'))->format('M j, Y \a\t g:i A') }}</p>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;font-size:14px;">
        @foreach ([
            'Email' => '<a href="mailto:'.e($application->email).'" style="color:#2e368f;">'.e($application->email).'</a>',
            'Phone' => '<a href="tel:'.e(preg_replace('/[^0-9+]/', '', $application->phone)).'" style="color:#2e368f;">'.e($application->phone).'</a>',
            'Positions' => e(implode(', ', $positions)),
            'Availability' => e($application->availability ?: '—'),
            'Valid CDL-A' => $application->has_cdl_a ? 'Yes' : 'No',
            'CDL-A experience' => e($application->experience_years ? $application->experience_years.' years' : '—'),
        ] as $label => $value)
            <tr>
                <td style="padding:10px 0;border-bottom:1px solid #eceef7;color:#7a7f9e;width:38%;vertical-align:top;">{{ $label }}</td>
                <td style="padding:10px 0;border-bottom:1px solid #eceef7;font-weight:600;">{!! $value !!}</td>
            </tr>
        @endforeach
    </table>

    <p style="margin:28px 0 8px;">
        <a href="{{ $adminUrl }}" style="display:inline-block;background:#e93232;color:#ffffff;text-decoration:none;font-weight:600;padding:12px 22px;border-radius:999px;">Open in dashboard</a>
    </p>
    <p style="font-size:12px;color:#7a7f9e;margin:16px 0 0;">Reply to this email to contact the applicant directly.</p>
@endcomponent
