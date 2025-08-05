<?php

/* database/migrations/2024_01_16_000001_create_pricing_bookings_table.php */
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('pricing_bookings', function (Blueprint $table) {
            $table->id();
            $table->boolean('singleton')->default(true)->unique();   // only 1 row
            $table->string('title');
            $table->text('description');
            $table->string('btn_name');
            $table->string('btn_link');
            $table->timestamps();
        });

        DB::table('pricing_bookings')->insert([
            'id'          => 1,
            'singleton'   => true,
            'title'       => 'Book a Demo',
            'description' => 'Let’s talk pricing, features, and next steps.',
            'btn_name'    => 'Book Now',
            'btn_link'    => '#',
            'created_at'  => now(),
            'updated_at'  => now(),
        ]);
    }
    public function down(): void
    {
        Schema::dropIfExists('pricing_bookings');
    }
};
