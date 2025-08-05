<?php

// database/migrations/2024_01_04_000001_create_video_sections_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('video_sections', function (Blueprint $table) {
            $table->id();
            $table->boolean('singleton')->default(true)->unique();   // one row only
            $table->string('title');
            $table->longText('description'); // html editor
            $table->string('video')->nullable();
            $table->timestamps();
        });

        // seed the single row (ID = 1)
        DB::table('video_sections')->insert([
            'id'          => 1,
            'singleton'   => true,
            'title'       => 'Video Title',
            'description' => '<p>Video description here…</p>',
            'video'       => null,
            'created_at'  => now(),
            'updated_at'  => now(),
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('video_sections');
    }
};

