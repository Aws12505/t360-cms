<?php

// database/migrations/2024_01_03_000001_create_hero_sections_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('hero_sections', function (Blueprint $table) {
            $table->id();
            $table->boolean('singleton')->default(true)->unique();   // one row only
            $table->string('title');
            $table->text('description');
            $table->string('image')->nullable();
            $table->timestamps();
        });

        // seed the single row (ID = 1)
        DB::table('hero_sections')->insert([
            'id'          => 1,
            'singleton'   => true,
            'title'       => 'Hero Title',
            'description' => 'Hero description here…',
            'image'       => null,
            'created_at'  => now(),
            'updated_at'  => now(),
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('hero_sections');
    }
};
