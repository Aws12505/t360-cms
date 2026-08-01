<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('beyond_hirings', function (Blueprint $table) {
            $table->id();
            $table->boolean('singleton')->default(true)->unique(); // one row only
            $table->string('hero_title');
            $table->text('hero_description');
            $table->string('hero_btn_name');
            $table->string('hero_btn_link');
            $table->string('cta_title');
            $table->text('cta_description');
            $table->string('cta_btn_name');
            $table->string('cta_btn_link');
            $table->timestamps();
        });

        // seed the single row (ID = 1)
        DB::table('beyond_hirings')->insert([
            'id'               => 1,
            'singleton'        => true,
            'hero_title'       => 'Need Help Beyond Driver Hiring?',
            'hero_description' => "<p>While driver recruiting is our primary focus, we also partner with AFPs and trucking companies in other areas of their operations. If you're facing a challenge that's impacting your business, we'd be happy to discuss how we can help.</p>",
            'hero_btn_name'    => 'Book a Free Consultation',
            'hero_btn_link'    => '/booking',
            'cta_title'        => "Let's Talk About Your Business",
            'cta_description'  => "<p>Whether you're looking to hire qualified drivers, improve operations, solve a specific challenge, or explore additional support, we'd love to learn more about your business.</p>",
            'cta_btn_name'     => 'Book a Free Consultation',
            'cta_btn_link'     => '/booking',
            'created_at'       => now(),
            'updated_at'       => now(),
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('beyond_hirings');
    }
};
