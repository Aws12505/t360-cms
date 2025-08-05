<?php

// database/migrations/2024_01_01_000001_create_header_settings_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('header_settings', function (Blueprint $table) {
            $table->id();
            $table->boolean('singleton')->default(true)->unique();   // ensures only one row
            $table->string('logo_image')->nullable();
            $table->string('favicon')->nullable();
            $table->string('btn1_name');
            $table->string('btn1_link');
            $table->string('btn2_name');
            $table->string('btn2_link');
            $table->timestamps();
        });

        // seed the single row (ID 1)
        DB::table('header_settings')->insert([
            'id'         => 1,
            'singleton'  => true,
            'btn1_name'  => 'Button 1',
            'btn1_link'  => '#',
            'btn2_name'  => 'Button 2',
            'btn2_link'  => '#',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('header_settings');
    }
};
