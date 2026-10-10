<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ $title ?? 'Trucking 360' }}</title>
</head>
<body style="margin:0;padding:0;background:#f5f6fb;font-family:Poppins,Segoe UI,Helvetica,Arial,sans-serif;color:#1f2340;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f5f6fb;padding:32px 12px;">
        <tr>
            <td align="center">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 4px 24px rgba(20,26,77,.08);">
                    <tr>
                        <td style="background:#141a4d;background-image:linear-gradient(120deg,#141a4d 0%,#2e368f 70%,#e93232 140%);padding:28px 32px;">
                            <div style="font-size:20px;font-weight:700;letter-spacing:.04em;color:#ffffff;">TRUCKING 360</div>
                            <div style="font-size:13px;color:#c9cdf2;margin-top:4px;">{{ $tagline ?? 'Driver Hiring' }}</div>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:32px;font-size:15px;line-height:1.65;">
                            {{ $slot }}
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:20px 32px;border-top:1px solid #eceef7;font-size:12px;color:#7a7f9e;">
                            Trucking 360 Solutions &middot; <a href="{{ config('services.website.url') }}" style="color:#2e368f;">trucking360solutions.com</a>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
