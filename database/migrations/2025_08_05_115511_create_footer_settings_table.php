<?php

// database/migrations/2024_01_02_000001_create_footer_settings_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('footer_settings', function (Blueprint $table) {
            $table->id();
            $table->boolean('singleton')->default(true)->unique();   // one row only
            $table->string('title');
            $table->text('description');
            $table->string('location');
            $table->string('phone');
            $table->string('email');
            $table->string('linkedin_url')->nullable();
            $table->string('facebook_url')->nullable();
            $table->timestamps();
        });

        // seed the single row (ID = 1)
        DB::table('footer_settings')->insert([
            'id'          => 1,
            'singleton'   => true,
            'title'       => 'Footer Title',
            'description' => 'Footer description here…',
            'location'    => 'City, Country',
            'phone'       => '+1 000 000 0000',
            'email'       => 'info@example.com',
            'linkedin_url'=> null,
            'facebook_url'=> null,
            'created_at'  => now(),
            'updated_at'  => now(),
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('footer_settings');
    }
};
