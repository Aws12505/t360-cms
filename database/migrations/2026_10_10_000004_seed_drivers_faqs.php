<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $now = now();

        $faqs = [
            ['What do I need to apply?', 'A valid Class A Commercial Driver\'s License (CDL-A), a current DOT medical card, and a safe driving record. Specific experience requirements are listed on each position.'],
            ['Who will I be driving for?', 'Trucking 360 partners with Amazon Freight Partner (AFP) fleets. Our recruiters match you with partner fleets whose routes, schedules and pay fit what you are looking for.'],
            ['How soon will I hear back?', 'Someone from our team will reach out within 2 business days of receiving your application.'],
            ['Can I apply for more than one position?', 'Yes. Select every position you are interested in on the application form, or choose "Open to any" and a recruiter will suggest the best fits.'],
            ['Does it cost anything to apply?', 'No. Applying and working with a Trucking 360 recruiter is always free for drivers.'],
        ];

        foreach ($faqs as $i => [$title, $description]) {
            DB::table('faqs')->insert([
                'title'       => $title,
                'description' => $description,
                'page'        => 'drivers',
                'order'       => $i,
                'created_at'  => $now,
                'updated_at'  => $now,
            ]);
        }
    }

    public function down(): void
    {
        DB::table('faqs')->where('page', 'drivers')->delete();
    }
};
