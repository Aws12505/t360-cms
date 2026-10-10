<?php

use App\Mail\DriverApplicationConfirmationMail;
use App\Mail\NewDriverApplicationMail;
use App\Models\DriverApplication;
use App\Models\DriverPosition;
use App\Models\HiringSetting;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;

uses(RefreshDatabase::class);

beforeEach(function () {
    config(['services.website.key' => 'test-key']);
    $this->withoutVite();
});

function makePosition(array $overrides = []): DriverPosition
{
    return DriverPosition::create(array_merge([
        'title' => 'Regional CDL-A Driver',
        'status' => 'published',
        'employment_type' => 'FULL_TIME',
        'summary' => 'Home weekly, Amazon Freight Partner routes.',
        'content' => '<p>Great job</p><img src="/storage/uploads/editor/a.jpg">',
        'pay_min' => 0.68,
        'pay_max' => 0.72,
        'pay_unit' => null,
        'pay_display' => '$0.68–0.72 CPM',
        'locations' => [['city' => 'Atlanta', 'state' => 'GA', 'postal_code' => '30301']],
    ], $overrides));
}

function applicationPayload(array $overrides = []): array
{
    return array_merge([
        'first_name' => 'Sam',
        'last_name' => 'Driver',
        'email' => 'Sam@Example.com',
        'phone' => '(470) 555-0101',
        'availability' => 'Immediately',
        'has_cdl_a' => true,
        'experience_years' => '3-5',
        'positions' => [],
        'client_ip' => '203.0.113.9',
    ], $overrides);
}

test('slugs are generated from the title and kept unique', function () {
    $a = makePosition();
    $b = makePosition();

    expect($a->slug)->toBe('regional-cdl-a-driver')
        ->and($b->slug)->toBe('regional-cdl-a-driver-2')
        ->and($a->date_posted)->not->toBeNull();
});

test('public api lists only published, unexpired positions without rounding pay', function () {
    makePosition(['title' => 'Live One']);
    makePosition(['title' => 'Draft One', 'status' => 'draft']);
    makePosition(['title' => 'Closed One', 'status' => 'closed']);
    makePosition(['title' => 'Expired One', 'date_posted' => now()->subDays(40), 'valid_through' => now()->subDay()]);

    $response = $this->getJson('/api/v1/drivers')->assertOk();

    $titles = collect($response->json('data.positions'))->pluck('title')->all();
    expect($titles)->toBe(['Live One'])
        ->and($response->json('data.positions.0.pay_min'))->toBe(0.68)
        ->and($response->json('data.page.hero_title'))->not->toBeEmpty()
        ->and($response->json('data.faqs'))->toHaveCount(5);
});

test('position endpoint handles published, closed and draft', function () {
    $live = makePosition(['title' => 'Live']);
    $closed = makePosition(['title' => 'Closed', 'status' => 'closed']);
    $draft = makePosition(['title' => 'Draft', 'status' => 'draft']);

    $this->getJson("/api/v1/drivers/positions/{$live->slug}")
        ->assertOk()
        ->assertJsonPath('data.position.status', 'published')
        ->assertJsonPath('data.position.pay_max', 0.72)
        ->assertJsonPath('data.position.content', fn ($html) => str_contains($html, 'src="http'));

    $this->getJson("/api/v1/drivers/positions/{$closed->slug}")
        ->assertOk()
        ->assertJsonPath('data.position.status', 'closed')
        ->assertJsonMissingPath('data.position.content');

    $this->getJson("/api/v1/drivers/positions/{$draft->slug}")->assertNotFound();
    $this->getJson('/api/v1/drivers/positions/nope')->assertNotFound();
});

test('applications require the website key', function () {
    $this->postJson('/api/v1/driver-applications', applicationPayload())->assertUnauthorized();
    $this->postJson('/api/v1/driver-applications', applicationPayload(), ['X-T360-Key' => 'wrong'])->assertUnauthorized();
});

test('applications validate input', function () {
    $this->postJson('/api/v1/driver-applications', applicationPayload(['email' => 'nope', 'first_name' => '']), ['X-T360-Key' => 'test-key'])
        ->assertStatus(422)
        ->assertJsonValidationErrors(['email', 'first_name']);
});

test('a valid application is stored and both emails are sent', function () {
    Mail::fake();
    HiringSetting::instance()->update(['notification_emails' => ['team@example.com', 'boss@example.com']]);

    $position = makePosition();
    $draft = makePosition(['title' => 'Hidden', 'status' => 'draft']);

    $this->postJson('/api/v1/driver-applications', applicationPayload([
        'positions' => [$position->id, $draft->id],
        'source_position_id' => $position->id,
    ]), ['X-T360-Key' => 'test-key'])
        ->assertCreated()
        ->assertJsonPath('success', true)
        ->assertJsonPath('message', fn ($m) => str_contains($m, 'Sam'));

    $application = DriverApplication::first();
    expect($application->email)->toBe('sam@example.com')
        ->and($application->status)->toBe('new')
        ->and($application->ip)->toBe('203.0.113.9')
        ->and($application->positionTitles())->toBe(['Regional CDL-A Driver']);

    Mail::assertSent(NewDriverApplicationMail::class, fn ($m) => $m->hasTo('team@example.com') && $m->hasTo('boss@example.com'));
    Mail::assertSent(DriverApplicationConfirmationMail::class, fn ($m) => $m->hasTo('sam@example.com'));
    expect($application->notes()->where('type', 'email')->count())->toBe(2);
});

test('notification emails can be switched off', function () {
    Mail::fake();
    HiringSetting::instance()->update(['notify_enabled' => false, 'confirmation_enabled' => false]);

    $this->postJson('/api/v1/driver-applications', applicationPayload(), ['X-T360-Key' => 'test-key'])->assertCreated();

    Mail::assertNothingSent();
});

test('applications are rate limited per client ip', function () {
    Mail::fake();
    foreach (range(1, 5) as $i) {
        $this->postJson('/api/v1/driver-applications', applicationPayload(), ['X-T360-Key' => 'test-key'])->assertCreated();
    }
    $this->postJson('/api/v1/driver-applications', applicationPayload(), ['X-T360-Key' => 'test-key'])->assertStatus(429);

    // A different driver behind the same website server is not blocked
    $this->postJson('/api/v1/driver-applications', applicationPayload(['client_ip' => '198.51.100.7']), ['X-T360-Key' => 'test-key'])->assertCreated();
});

test('admin can change status, which is logged, and add notes', function () {
    $user = User::factory()->create();
    $application = DriverApplication::create(applicationPayload(['email' => 'a@b.com']));

    $this->actingAs($user)
        ->patch(route('admin.driver-applications.status', $application), ['status' => 'contacted'])
        ->assertRedirect();

    $this->actingAs($user)
        ->post(route('admin.driver-applications.notes.store', $application), ['body' => 'Left a voicemail'])
        ->assertRedirect();

    $application->refresh();
    expect($application->status)->toBe('contacted')
        ->and($application->notes()->where('type', 'status_change')->first()->body)->toContain('Contacted')
        ->and($application->notes()->where('type', 'note')->first()->user_id)->toBe($user->id);
});

test('admin pages render', function () {
    $user = User::factory()->create();
    $position = makePosition();
    $application = DriverApplication::create(applicationPayload(['email' => 'a@b.com']));

    $this->actingAs($user)->get(route('admin.driver-positions.index'))->assertOk();
    $this->actingAs($user)->get(route('admin.driver-positions.create'))->assertOk();
    $this->actingAs($user)->get(route('admin.driver-positions.edit', $position))->assertOk();
    $this->actingAs($user)->get(route('admin.driver-applications.index', ['q' => 'Sam', 'view' => $application->id]))->assertOk();
    $this->actingAs($user)->get(route('admin.driver-applications.show', $application))->assertOk();
    $this->actingAs($user)->get(route('admin.drivers-page.edit'))->assertOk();
    $this->actingAs($user)->get(route('admin.hiring-settings.edit'))->assertOk();
    $this->actingAs($user)->get(route('admin.driver-applications.export'))->assertOk();

    expect($application->fresh()->read_at)->not->toBeNull();
});

test('admin can create, publish via status endpoint and duplicate a position', function () {
    $user = User::factory()->create();

    $this->actingAs($user)->post(route('admin.driver-positions.store'), [
        'title' => 'Local Day Cab Driver',
        'status' => 'draft',
        'employment_type' => 'FULL_TIME',
        'pay_min' => 25,
        'pay_max' => 28.5,
        'pay_unit' => 'HOUR',
        'locations' => [['city' => 'Dallas', 'state' => 'TX'], ['city' => '', 'state' => '']],
        'requirements' => ['Valid CDL-A', ''],
    ])->assertRedirect();

    $position = DriverPosition::first();
    expect($position->slug)->toBe('local-day-cab-driver')
        ->and($position->locations)->toHaveCount(1)
        ->and($position->requirements)->toBe(['Valid CDL-A']);

    $this->actingAs($user)->patch(route('admin.driver-positions.status', $position), ['status' => 'published'])->assertRedirect();
    expect($position->fresh()->status)->toBe('published');

    $this->actingAs($user)->post(route('admin.driver-positions.duplicate', $position))->assertRedirect();
    $copy = DriverPosition::latest('id')->first();
    expect($copy->status)->toBe('draft')->and($copy->slug)->toBe('local-day-cab-driver-copy');
});

test('editor images are uploaded as files, not base64', function () {
    \Illuminate\Support\Facades\Storage::fake('public');
    $user = User::factory()->create();

    $response = $this->actingAs($user)
        ->postJson(route('admin.editor-uploads.store'), [
            'image' => \Illuminate\Http\UploadedFile::fake()->image('truck.jpg', 2400, 1200),
        ])
        ->assertOk()
        ->assertJsonStructure(['url', 'width', 'height']);

    expect($response->json('url'))->toContain('/storage/uploads/editor/')
        ->and($response->json('width'))->toBe(1920);

    $this->actingAs($user)
        ->postJson(route('admin.editor-uploads.store'), ['image' => \Illuminate\Http\UploadedFile::fake()->create('evil.svg', 5, 'image/svg+xml')])
        ->assertStatus(422);
});

test('hiring settings can send test emails and validate recipients', function () {
    Mail::fake();
    $user = User::factory()->create();

    $this->actingAs($user)->post(route('admin.hiring-settings.test'), ['email' => 'me@example.com'])->assertRedirect();
    Mail::assertSent(NewDriverApplicationMail::class);
    Mail::assertSent(DriverApplicationConfirmationMail::class);

    $this->actingAs($user)->put(route('admin.hiring-settings.update'), [
        'notify_enabled' => true,
        'notification_emails' => ['not-an-email'],
        'confirmation_enabled' => true,
    ])->assertSessionHasErrors('notification_emails.0');
});

test('drivers page content can be updated', function () {
    $user = User::factory()->create();

    $this->actingAs($user)->put(route('admin.drivers-page.update'), [
        'hero_title' => 'Drive with *Trucking 360*',
        'trust_chips' => ['Weekly pay', ''],
        'why_items' => [['icon' => 'dollar', 'title' => 'Pay', 'description' => 'Good'], ['icon' => 'star', 'title' => '', 'description' => '']],
        'availability_options' => ['Now'],
    ])->assertRedirect();

    $page = \App\Models\DriversPage::instance();
    expect($page->hero_title)->toBe('Drive with *Trucking 360*')
        ->and($page->trust_chips)->toBe(['Weekly pay'])
        ->and($page->why_items)->toHaveCount(1);
});
