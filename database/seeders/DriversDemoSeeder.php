<?php

namespace Database\Seeders;

use App\Models\DriverApplication;
use App\Models\DriverApplicationNote;
use App\Models\DriverPosition;
use App\Models\User;
use Illuminate\Database\Seeder;

/**
 * Sample hiring data for development and demos: job positions in every state
 * (published, featured, draft, closed) plus applications across the whole pipeline.
 *
 *   php artisan db:seed --class=DriversDemoSeeder
 *
 * Safe to run again: positions are matched by slug and demo applicants by their
 * @example.test email, so nothing is duplicated and real data is never touched.
 * No emails are sent. Do not run this on the production database.
 */
class DriversDemoSeeder extends Seeder
{
    private const DEMO_EMAIL_DOMAIN = '@example.test';

    public function run(): void
    {
        $positions = $this->seedPositions();
        $this->seedApplications($positions);

        $this->command?->info(sprintf(
            'Seeded %d positions (%d published) and %d demo applications.',
            count($positions),
            DriverPosition::where('status', 'published')->count(),
            DriverApplication::where('email', 'like', '%' . self::DEMO_EMAIL_DOMAIN)->count(),
        ));
    }

    /**
     * @return array<string, DriverPosition> keyed by slug
     */
    private function seedPositions(): array
    {
        $rows = [
            [
                'slug' => 'regional-cdl-a-driver-home-weekly',
                'title' => 'Regional CDL-A Driver – Home Weekly',
                'status' => 'published', 'is_featured' => true, 'order' => 1, 'posted' => 12, 'valid' => 45,
                'summary' => 'Dedicated Amazon Freight Partner lanes out of Atlanta. Home every weekend, newer equipment and weekly direct deposit.',
                'content' => '<p>Run dedicated regional lanes for an Amazon Freight Partner fleet based in metro Atlanta. Freight is <strong>100% no-touch</strong> drop-and-hook, so you spend your time driving, not waiting.</p>'
                    . '<dl class="t3d-stats"><div class="t3d-stat"><dd>$1,800+</dd><dt>Avg. weekly pay</dt></div><div class="t3d-stat"><dd>Weekly</dd><dt>Home time</dt></div><div class="t3d-stat"><dd>2024</dd><dt>Kenworth T680s</dt></div></dl>'
                    . '<h2>What a week looks like</h2><ol><li data-list="bullet">Start Monday morning from the Atlanta yard</li><li data-list="bullet">Regional loops across GA, TN, AL and the Carolinas</li><li data-list="bullet">Back home Friday evening</li></ol>'
                    . '<aside class="t3d-callout t3d-callout--highlight">$2,500 sign-on bonus for drivers who start this month.</aside>'
                    . '<p class="t3d-cta"><a class="t3d-btn" href="#apply">Apply now</a></p>',
                'employment_type' => 'FULL_TIME', 'route_type' => 'Regional', 'home_time' => 'Home weekly', 'schedule' => 'Mon–Fri',
                'equipment' => "2024 Kenworth T680, 53' dry van",
                'pay_min' => 1600, 'pay_max' => 1900, 'pay_unit' => 'WEEK',
                'locations' => [['city' => 'Atlanta', 'state' => 'GA', 'postal_code' => '30336']],
                'requirements' => ['Valid Class A CDL', '1+ year of verifiable CDL-A experience', 'Current DOT medical card', 'Clean MVR: no major violations in 3 years'],
                'benefits' => ['Weekly direct deposit', 'Medical, dental & vision', 'Paid time off', '401(k) with match'],
                'highlights' => [['label' => 'Sign-on bonus', 'value' => '$2,500'], ['label' => 'Freight', 'value' => 'No-touch']],
            ],
            [
                'slug' => 'local-day-cab-driver',
                'title' => 'Local Day Cab Driver',
                'status' => 'published', 'is_featured' => false, 'order' => 2, 'posted' => 9, 'valid' => 30,
                'summary' => 'Home every night. Local Amazon middle-mile routes around Dallas–Fort Worth.',
                'content' => '<p>Shuttle trailers between Amazon facilities across the DFW metroplex. Predictable shifts, home daily, and a team that actually answers the phone.</p>'
                    . '<h2>The role</h2><ul><li>Drop-and-hook between sort centers and delivery stations</li><li>4 on / 3 off, overnight shifts</li><li>Late-model day cabs, well maintained</li></ul>',
                'employment_type' => 'FULL_TIME', 'route_type' => 'Local', 'home_time' => 'Home daily', 'schedule' => '4 on / 3 off, nights',
                'equipment' => 'Freightliner Cascadia day cab',
                'pay_min' => 27, 'pay_max' => 30, 'pay_unit' => 'HOUR',
                'locations' => [['city' => 'Dallas', 'state' => 'TX', 'postal_code' => '75241'], ['city' => 'Fort Worth', 'state' => 'TX', 'postal_code' => '76106']],
                'requirements' => ['Valid Class A CDL', '6+ months of experience', 'Able to pass a DOT drug screen'],
                'benefits' => ['Home daily', 'Paid weekly', 'Overtime after 40 hours', 'Medical after 30 days'],
                'highlights' => [['label' => 'Shift', 'value' => 'Nights']],
            ],
            [
                'slug' => 'otr-team-driver',
                'title' => 'OTR Team Driver',
                'status' => 'published', 'is_featured' => false, 'order' => 3, 'posted' => 6, 'valid' => null,
                'summary' => 'Coast-to-coast team runs with top-tier pay per mile, split between co-drivers.',
                'content' => '<p>Team OTR for an Amazon Freight Partner fleet. High miles, split pay, and a truck that never sits.</p>'
                    . '<aside class="t3d-callout t3d-callout--info">Already have a co-driver? Apply together and we will keep you paired.</aside>',
                'employment_type' => 'FULL_TIME', 'route_type' => 'OTR', 'home_time' => 'Out 2–3 weeks', 'schedule' => 'Continuous team operation',
                'equipment' => '2023+ Volvo VNL 860 sleeper',
                'pay_min' => null, 'pay_max' => null, 'pay_unit' => null, 'pay_display' => '$0.68–0.72 CPM (split)',
                'locations' => [['city' => 'Columbus', 'state' => 'OH', 'postal_code' => '43207']],
                'requirements' => ['Valid Class A CDL', '2+ years of OTR experience', 'Team-driving experience preferred'],
                'benefits' => ['Per-mile pay with detention', 'Health coverage from day one', 'Rider and pet policy'],
                'highlights' => [['label' => 'Pay', 'value' => '$0.68–0.72 CPM'], ['label' => 'Team', 'value' => 'Split pay']],
            ],
            [
                'slug' => 'dedicated-regional-driver-charlotte',
                'title' => 'Dedicated Regional Driver – Charlotte',
                'status' => 'published', 'is_featured' => false, 'order' => 4, 'posted' => 3, 'valid' => 60,
                'summary' => 'Dedicated Charlotte-to-Raleigh lanes. Same trailers, same lanes, home 2–3 nights a week.',
                'content' => '<p>A steady dedicated account for drivers who want routine. Know your lanes, know your schedule, know when you are home.</p>',
                'employment_type' => 'FULL_TIME', 'route_type' => 'Dedicated', 'home_time' => 'Home 2–3 nights/week', 'schedule' => 'Set weekly schedule',
                'equipment' => "2022+ International LT, 53' reefer",
                'pay_min' => 72000, 'pay_max' => 84000, 'pay_unit' => 'YEAR',
                'locations' => [['city' => 'Charlotte', 'state' => 'NC', 'postal_code' => '28208'], ['city' => 'Raleigh', 'state' => 'NC', 'postal_code' => '27610']],
                'requirements' => ['Valid Class A CDL', '2+ years of experience', 'Reefer experience a plus'],
                'benefits' => ['Salary-equivalent guaranteed pay', 'Paid holidays', '401(k)'],
                'highlights' => [['label' => 'Pay', 'value' => '$72k–$84k / year']],
            ],
            [
                'slug' => 'weekend-relief-driver-phoenix',
                'title' => 'Weekend Relief Driver – Phoenix',
                'status' => 'published', 'is_featured' => false, 'order' => 5, 'posted' => 1, 'valid' => 21,
                'summary' => 'Part-time weekend shifts covering Phoenix-area Amazon routes. Great second income.',
                'content' => '<p>Cover Saturday and Sunday routes around the Phoenix valley. Short, predictable runs and weekday freedom.</p>',
                'employment_type' => 'PART_TIME', 'route_type' => 'Local', 'home_time' => 'Home nightly', 'schedule' => 'Sat–Sun',
                'equipment' => 'Day cab',
                'pay_min' => 28, 'pay_max' => 28, 'pay_unit' => 'HOUR',
                'locations' => [['city' => 'Phoenix', 'state' => 'AZ', 'postal_code' => '85043']],
                'requirements' => ['Valid Class A CDL', '1+ year of experience'],
                'benefits' => ['Flexible weekend schedule', 'Weekly pay'],
                'highlights' => [['label' => 'Schedule', 'value' => 'Weekends']],
            ],
            [
                'slug' => 'owner-operator-lane-partner-nashville',
                'title' => 'Owner-Operator Lane Partner – Nashville',
                'status' => 'published', 'is_featured' => false, 'order' => 6, 'posted' => 20, 'valid' => 14,
                'summary' => 'Bring your own tractor. Guaranteed weekly lane commitments out of Nashville.',
                'content' => '<p>Own your truck and want consistent freight? Lease on to a guaranteed Amazon Freight Partner lane program with fuel discounts and fast settlements.</p>',
                'employment_type' => 'CONTRACTOR', 'route_type' => 'Regional', 'home_time' => 'Home weekly', 'schedule' => 'Flexible',
                'equipment' => 'Your own tractor (2018 or newer)',
                'pay_min' => null, 'pay_max' => null, 'pay_unit' => null, 'pay_display' => '$2.10–2.35 / mile',
                'locations' => [['city' => 'Nashville', 'state' => 'TN', 'postal_code' => '37210']],
                'requirements' => ['Valid Class A CDL', 'Own tractor 2018 or newer', 'Active MC authority or lease-on'],
                'benefits' => ['Fuel discounts', '7-day settlements', 'Guaranteed lane volume'],
                'highlights' => [['label' => 'Rate', 'value' => '$2.10–2.35 / mile']],
            ],
            [
                'slug' => 'night-shift-yard-and-road-driver-memphis',
                'title' => 'Night Shift Yard & Road Driver – Memphis',
                'status' => 'draft', 'is_featured' => false, 'order' => 7, 'posted' => null, 'valid' => null,
                'summary' => 'Draft: waiting on final pay numbers from the carrier.',
                'content' => '<p>Mix of yard shuttling and short regional hauls on the night shift.</p>',
                'employment_type' => 'FULL_TIME', 'route_type' => 'Local', 'home_time' => 'Home daily', 'schedule' => 'Nights',
                'pay_min' => null, 'pay_max' => null, 'pay_unit' => null,
                'locations' => [['city' => 'Memphis', 'state' => 'TN', 'postal_code' => '38118']],
                'requirements' => ['Valid Class A CDL'],
                'benefits' => [],
                'highlights' => [],
            ],
            [
                'slug' => 'dedicated-reefer-driver-memphis',
                'title' => 'Dedicated Reefer Driver – Memphis',
                'status' => 'closed', 'is_featured' => false, 'order' => 8, 'posted' => 50, 'valid' => null,
                'summary' => 'This role has been filled.',
                'content' => '<p>Dedicated reefer lanes from Memphis. Position filled.</p>',
                'employment_type' => 'FULL_TIME', 'route_type' => 'Dedicated', 'home_time' => 'Home weekly',
                'pay_min' => 1500, 'pay_max' => 1750, 'pay_unit' => 'WEEK',
                'locations' => [['city' => 'Memphis', 'state' => 'TN', 'postal_code' => '38118']],
                'requirements' => ['Valid Class A CDL', 'Reefer experience'],
                'benefits' => ['Weekly pay'],
                'highlights' => [],
            ],
        ];

        $positions = [];

        foreach ($rows as $row) {
            $posted = $row['posted'];
            $valid = $row['valid'];
            unset($row['posted'], $row['valid']);

            $position = DriverPosition::withTrashed()->firstOrNew(['slug' => $row['slug']]);
            $position->fill($row + [
                'pay_display' => null,
                'equipment' => null,
                'schedule' => null,
                'pay_currency' => 'USD',
            ]);
            $position->date_posted = $posted !== null ? now()->subDays($posted)->toDateString() : null;
            $position->valid_through = $valid !== null ? now()->addDays($valid)->toDateString() : null;
            $position->deleted_at = null;
            $position->save();

            $positions[$position->slug] = $position;
        }

        return $positions;
    }

    /**
     * @param array<string, DriverPosition> $positions
     */
    private function seedApplications(array $positions): void
    {
        $p = fn (string $slug) => $positions[$slug] ?? null;
        $reviewer = User::query()->orderBy('id')->first();

        // Each applicant: days ago, status, read?, positions applied to, source position, notes
        $applicants = [
            ['Marcus', 'Johnson', 'marcus.johnson', '(404) 555-0142', 'Immediately', true, '5+', 0.2, 'new', false, ['regional-cdl-a-driver-home-weekly'], 'regional-cdl-a-driver-home-weekly', []],
            ['Priya', 'Patel', 'priya.patel', '(214) 555-0178', 'Within 2 weeks', true, '3-5', 0.6, 'new', false, ['local-day-cab-driver', 'weekend-relief-driver-phoenix'], 'local-day-cab-driver', []],
            ['Devon', 'Williams', 'devon.williams', '(615) 555-0119', 'Immediately', true, '3-5', 1, 'new', false, [], null, []],
            ['Sofia', 'Ramirez', 'sofia.ramirez', '(602) 555-0163', 'Within 30 days', true, '1-2', 2, 'new', true, ['weekend-relief-driver-phoenix'], 'weekend-relief-driver-phoenix', []],
            ['Tyrone', 'Brooks', 'tyrone.brooks', '(704) 555-0194', 'Within 2 weeks', true, '5+', 3, 'contacted', true, ['dedicated-regional-driver-charlotte'], 'dedicated-regional-driver-charlotte', [
                ['note', 'Left a voicemail. Will try again tomorrow morning.', 2.8],
                ['note', 'Spoke for 15 minutes. Very interested in the Charlotte dedicated lanes, wants details on home time.', 2.1],
            ]],
            ['Hannah', 'Kowalski', 'hannah.kowalski', '(614) 555-0127', 'Immediately', true, '3-5', 4, 'contacted', true, ['otr-team-driver'], 'otr-team-driver', [
                ['note', 'Has a co-driver (husband, also CDL-A). Send both applications through together.', 3.5],
            ]],
            ['Carlos', 'Mendoza', 'carlos.mendoza', '(469) 555-0151', 'Within 2 weeks', true, '1-2', 5, 'contacted', true, ['local-day-cab-driver', 'regional-cdl-a-driver-home-weekly'], 'local-day-cab-driver', [
                ['note', 'Needs home daily. Steered toward the DFW day cab role.', 4.4],
            ]],
            ['Jamal', 'Carter', 'jamal.carter', '(678) 555-0185', 'Immediately', true, '5+', 7, 'hired', true, ['regional-cdl-a-driver-home-weekly'], 'regional-cdl-a-driver-home-weekly', [
                ['note', 'Great call. Clean MVR, 8 years experience.', 6.5],
                ['note', 'Offer accepted. Orientation scheduled for Monday.', 4.2],
            ]],
            ['Elena', 'Petrov', 'elena.petrov', '(480) 555-0136', 'Within 30 days', true, '3-5', 9, 'hired', true, ['weekend-relief-driver-phoenix'], 'weekend-relief-driver-phoenix', [
                ['note', 'Looking for a second income on weekends. Perfect fit.', 8.2],
            ]],
            ['Brandon', 'Lee', 'brandon.lee', '(901) 555-0172', 'Just exploring', false, '<1', 6, 'not_a_fit', true, ['dedicated-reefer-driver-memphis'], 'dedicated-reefer-driver-memphis', [
                ['note', "No CDL yet, still in school. Told him to reapply once he's licensed.", 5.5],
            ]],
            ['Angela', 'Foster', 'angela.foster', '(615) 555-0108', 'Within 2 weeks', true, '5+', 11, 'not_a_fit', true, ['owner-operator-lane-partner-nashville'], 'owner-operator-lane-partner-nashville', [
                ['note', "Doesn't own a tractor, only interested in company driver roles.", 10.1],
            ]],
            ['Nathan', 'Cole', 'nathan.cole', '(770) 555-0147', 'Within 30 days', true, '1-2', 13, 'contacted', true, ['regional-cdl-a-driver-home-weekly', 'otr-team-driver'], null, [
                ['note', 'Wants to stay local first. Revisit OTR in 6 months.', 12],
            ]],
            ['Maya', 'Singh', 'maya.singh', '(972) 555-0199', 'Immediately', true, '3-5', 16, 'hired', true, ['local-day-cab-driver'], 'local-day-cab-driver', [
                ['note', 'Started last week. Doing great.', 8],
            ]],
            ['Isaiah', 'Turner', 'isaiah.turner', '(336) 555-0121', 'Within 2 weeks', true, '5+', 21, 'contacted', true, ['dedicated-regional-driver-charlotte', 'regional-cdl-a-driver-home-weekly'], 'dedicated-regional-driver-charlotte', [
                ['note', 'Waiting on his previous employer to confirm dates.', 18],
            ]],
            ['Grace', 'Okafor', 'grace.okafor', '(615) 555-0165', 'Within 30 days', true, '1-2', 26, 'not_a_fit', true, [], null, [
                ['note', 'Outside our service area (Seattle). Added to the notify list.', 25],
            ]],
        ];

        foreach ($applicants as [$first, $last, $emailLocal, $phone, $availability, $hasCdl, $experience, $daysAgo, $status, $read, $positionSlugs, $sourceSlug, $notes]) {
            $applied = now()->subMinutes((int) round($daysAgo * 24 * 60));
            $email = $emailLocal . self::DEMO_EMAIL_DOMAIN;

            $application = DriverApplication::withTrashed()->firstOrNew(['email' => $email]);
            $isNew = !$application->exists;

            $application->fill([
                'first_name' => $first,
                'last_name' => $last,
                'phone' => $phone,
                'availability' => $availability,
                'has_cdl_a' => $hasCdl,
                'experience_years' => $experience,
                'status' => $status,
                'source_position_id' => $sourceSlug ? $p($sourceSlug)?->id : null,
                'source_url' => $sourceSlug ? "https://trucking360solutions.com/drivers/{$sourceSlug}" : 'https://trucking360solutions.com/drivers',
                'utm' => $isNew && $daysAgo % 3 === 0 ? ['utm_source' => 'facebook', 'utm_medium' => 'social', 'utm_campaign' => 'cdl-a-fall-hiring'] : $application->utm,
                'ip' => '203.0.113.' . (10 + crc32($email) % 200),
                'user_agent' => 'Mozilla/5.0 (demo seed)',
            ]);
            $application->read_at = $read ? $applied->copy()->addHours(3) : null;
            $application->created_at = $applied;
            $application->updated_at = $applied;
            $application->deleted_at = null;
            $application->save();

            // Preferred positions (snapshot of the title, like real submissions)
            $application->positionRows()->delete();
            foreach ($positionSlugs as $slug) {
                if ($position = $p($slug)) {
                    $application->positionRows()->create([
                        'driver_position_id' => $position->id,
                        'position_title' => $position->title,
                    ]);
                }
            }

            // Timeline: only on first seed so re-running does not stack duplicates
            if ($isNew) {
                $this->note($application, 'email', 'New application notification sent to hiring@trucking360solutions.com', $applied->copy()->addSeconds(4));
                $this->note($application, 'email', "Confirmation email sent to {$email}", $applied->copy()->addSeconds(5));

                if ($status !== 'new') {
                    $this->note($application, 'status_change', 'Status changed from New to Contacted', $applied->copy()->addHours(5), $reviewer?->id, ['from' => 'new', 'to' => 'contacted']);
                }
                foreach ($notes as [$type, $body, $notedDaysAgo]) {
                    $this->note($application, $type, $body, now()->subMinutes((int) round($notedDaysAgo * 24 * 60)), $reviewer?->id);
                }
                if (in_array($status, ['hired', 'not_a_fit'], true)) {
                    $label = $status === 'hired' ? 'Hired' : 'Not a fit';
                    $this->note($application, 'status_change', "Status changed from Contacted to {$label}", now()->subHours(max(1, (int) ($daysAgo * 12))), $reviewer?->id, ['from' => 'contacted', 'to' => $status]);
                }
            }
        }
    }

    private function note(DriverApplication $application, string $type, string $body, $at, ?int $userId = null, array $meta = []): void
    {
        $note = new DriverApplicationNote([
            'driver_application_id' => $application->id,
            'user_id' => $type === 'email' ? null : $userId,
            'type' => $type,
            'body' => $body,
            'meta' => $meta ?: null,
        ]);
        $note->created_at = $at;
        $note->updated_at = $at;
        $note->save();
    }
}
