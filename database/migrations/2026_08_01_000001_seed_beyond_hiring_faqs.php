<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $now = now();

        DB::table('faqs')->insert([
            [
                'title'       => 'How do I find out if you can help with my business?',
                'description' => "The best way is to schedule a meeting with our team. We'll take the time to understand your operation, discuss the challenges you're facing, and explore how our solutions can be tailored to support your business and help you achieve your goals.",
                'page'        => 'beyond-hiring',
                'order'       => 0,
                'created_at'  => $now,
                'updated_at'  => $now,
            ],
            [
                'title'       => 'What additional services do you offer?',
                'description' => 'Our additional solutions may include dispatch support, fleet management, HR services, operational consulting, compliance assistance, and other customized services designed to help trucking companies improve efficiency and grow their business.',
                'page'        => 'beyond-hiring',
                'order'       => 1,
                'created_at'  => $now,
                'updated_at'  => $now,
            ],
            [
                'title'       => "Why aren't these services listed in detail as the hiring service?",
                'description' => 'Every trucking company has different goals, fleet sizes, and operational requirements. Because of that, our additional services are customized rather than one-size-fits-all. We discuss your needs first and then recommend the best approach.',
                'page'        => 'beyond-hiring',
                'order'       => 2,
                'created_at'  => $now,
                'updated_at'  => $now,
            ],
            [
                'title'       => 'How do I know which services are right for my business?',
                'description' => "Every trucking company operates differently. During a consultation, we'll learn about your current operation, discuss your challenges and goals, and recommend the solutions that best fit your business.",
                'page'        => 'beyond-hiring',
                'order'       => 3,
                'created_at'  => $now,
                'updated_at'  => $now,
            ],
            [
                'title'       => 'How do I get started?',
                'description' => "Simply book a free consultation with our team. We'll review your current operation, answer any questions you have, and identify opportunities where Trucking 360 can add value and support your growth.",
                'page'        => 'beyond-hiring',
                'order'       => 4,
                'created_at'  => $now,
                'updated_at'  => $now,
            ],
        ]);
    }

    public function down(): void
    {
        DB::table('faqs')->where('page', 'beyond-hiring')->delete();
    }
};
