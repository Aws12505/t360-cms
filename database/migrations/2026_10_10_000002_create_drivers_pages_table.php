<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('drivers_pages', function (Blueprint $table) {
            $table->id();
            $table->boolean('singleton')->default(true)->unique(); // one row only

            // Hero
            $table->string('hero_eyebrow')->nullable();
            $table->string('hero_title');
            $table->text('hero_subtitle')->nullable();
            $table->string('hero_image')->nullable(); // falls back to the bundled website image when empty
            $table->string('hero_primary_btn')->nullable();
            $table->string('hero_secondary_btn')->nullable();
            $table->string('recruiter_phone')->nullable(); // falls back to the footer phone when empty
            $table->json('trust_chips')->nullable();

            // Open positions
            $table->string('positions_title')->nullable();
            $table->text('positions_subtitle')->nullable();
            $table->text('empty_state')->nullable();

            // Why drive with us
            $table->string('why_title')->nullable();
            $table->text('why_subtitle')->nullable();
            $table->json('why_items')->nullable(); // [{icon, title, description}]

            // Feature split
            $table->string('feature_title')->nullable();
            $table->text('feature_body')->nullable(); // HTML
            $table->string('feature_image')->nullable();

            // How it works
            $table->string('steps_title')->nullable();
            $table->json('steps')->nullable(); // [{title, description}]

            // Application form
            $table->string('form_title')->nullable();
            $table->text('form_subtitle')->nullable();
            $table->json('availability_options')->nullable(); // ["Immediately", ...]
            $table->text('success_message')->nullable();      // supports {first_name}

            // Final CTA
            $table->string('cta_title')->nullable();
            $table->text('cta_body')->nullable();

            // SEO
            $table->string('seo_title')->nullable();
            $table->string('seo_description', 320)->nullable();
            $table->string('og_image')->nullable();

            $table->timestamps();
        });

        DB::table('drivers_pages')->insert([
            'id'                 => 1,
            'singleton'          => true,
            'hero_eyebrow'       => 'Now hiring · CDL-A drivers',
            'hero_title'         => 'Drive with *Amazon Freight Partners*',
            'hero_subtitle'      => 'Skip the job-board hunt. Trucking 360 matches qualified CDL-A drivers with open Amazon Freight Partner routes. Apply in under a minute and talk to a real recruiter.',
            'hero_primary_btn'   => 'Apply Now',
            'hero_secondary_btn' => 'Call a Recruiter',
            'trust_chips'        => json_encode(['CDL-A positions open', 'Amazon Freight Partner routes', 'Real recruiter support']),

            'positions_title'    => 'Open positions',
            'positions_subtitle' => 'Find a route that fits your life. New openings are added as our partners grow.',
            'empty_state'        => "We don't have a listed opening right now, but our partners hire all the time. Send us your details and a recruiter will reach out when a route that fits opens up.",

            'why_title'          => 'Why drivers choose Trucking 360',
            'why_subtitle'       => 'Your next CDL-A job starts here.',
            'why_items'          => json_encode([
                ['icon' => 'route',   'title' => 'Many open positions',       'description' => 'Multiple CDL-A openings with Amazon Freight Partners, so you can find a route that fits.'],
                ['icon' => 'dollar',  'title' => 'Competitive pay',           'description' => 'Weekly pay and clear, upfront compensation details for every position.'],
                ['icon' => 'shield',  'title' => 'Safety & compliance first', 'description' => 'We help with documentation and onboarding so you can start with confidence.'],
                ['icon' => 'headset', 'title' => 'Real recruiter support',    'description' => 'Talk to a person who knows the roles, the routes and the requirements.'],
            ]),

            'feature_title'      => 'A recruiter in your corner, not a job board',
            'feature_body'       => '<p>Every application is read by a real person on our team. We learn what you want — home time, route type, pay — and match you with Amazon Freight Partner fleets that fit.</p><ul><li>One application, many fleets</li><li>Straight answers about pay and schedules</li><li>Help with paperwork and onboarding</li></ul>',

            'steps_title'        => 'How it works',
            'steps'              => json_encode([
                ['title' => 'Apply in a minute',      'description' => 'Tell us a little about yourself and the positions you want.'],
                ['title' => 'Talk to a recruiter',    'description' => 'Someone from our team reaches out within 2 business days.'],
                ['title' => 'Onboard and drive',      'description' => 'We help you through paperwork and onboarding so you can hit the road.'],
            ]),

            'form_title'           => 'Apply to drive',
            'form_subtitle'        => 'A few quick fields. A recruiter will contact you within 2 business days.',
            'availability_options' => json_encode(['Immediately', 'Within 2 weeks', 'Within 30 days', 'Just exploring']),
            'success_message'      => 'Thanks, {first_name}! Your application is in. Someone from our team will reach out within 2 business days. We also sent a confirmation to your email.',

            'cta_title'          => 'Ready to get behind the wheel?',
            'cta_body'           => 'Apply today and a Trucking 360 recruiter will be in touch within 2 business days.',

            'seo_title'          => 'CDL-A Driver Jobs with Amazon Freight Partners',
            'seo_description'    => 'Now hiring CDL-A truck drivers for Amazon Freight Partner routes. Browse open positions, see pay and home time, and apply in under a minute with Trucking 360.',

            'created_at'         => now(),
            'updated_at'         => now(),
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('drivers_pages');
    }
};
