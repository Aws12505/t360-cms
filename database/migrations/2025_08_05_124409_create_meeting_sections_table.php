<?php

// database/migrations/2024_01_07_000001_create_meeting_sections_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('meeting_sections', function (Blueprint $table) {
            $table->id();
            $table->boolean('singleton')->default(true)->unique();   // one row only
            $table->string('title');
            $table->text('description');
            $table->string('btn_name');
            $table->string('btn_link');
            $table->string('image')->nullable();
            $table->timestamps();
        });

        // seed the single row (ID = 1)
        DB::table('meeting_sections')->insert([
            'id'          => 1,
            'singleton'   => true,
            'title'       => 'Meeting Title',
            'description' => 'Meeting description here…',
            'btn_name'    => 'Book Meeting',
            'btn_link'    => '#',
            'image'       => null,
            'created_at'  => now(),
            'updated_at'  => now(),
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('meeting_sections');
    }
};

