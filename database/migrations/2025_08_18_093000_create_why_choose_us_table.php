<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('why_choose_us', function (Blueprint $table) {
            $table->id();
            $table->boolean('singleton')->default(true)->unique(); // one row only
            $table->string('title');
            $table->string('subtitle');
            $table->text('description');
            $table->timestamps();
        });

        // seed the single row (ID = 1)
        DB::table('why_choose_us')->insert([
            'id'          => 1,
            'singleton'   => true,
            'title'       => 'Our Commitment to Excellence',
            'subtitle'    => 'Why Choose Us!',
            'description' => "Discover why we're the preferred choice for AFPs. With a client-first approach, we deliver efficient, tailored solutions that drive your business toward achieving a Fantastic Plus rating. Our team combines expertise, transparency, and accountability to ensure your success, supported by consistent performance and comprehensive services.",
            'created_at'  => now(),
            'updated_at'  => now(),
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('why_choose_us');
    }
};
