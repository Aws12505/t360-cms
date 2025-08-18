<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('dashboard360s', function (Blueprint $table) {
            $table->id();
            $table->boolean('singleton')->default(true)->unique(); // Singleton pattern
            $table->string('title');
            $table->text('description'); // HTML
            $table->string('video')->nullable(); // video file path
            $table->string('btn_text')->nullable();
            $table->string('btn_link')->nullable();
            $table->timestamps();
        });

        // seed the single row (ID = 1)
        DB::table('dashboard360s')->insert([
            'id' => 1,
            'singleton' => true,
            'title' => 'Dashboard 360 Title',
            'description' => '<p>Dashboard360 description goes here.</p>',
            'video' => null,
            'btn_text' => 'Learn More',
            'btn_link' => '#',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('dashboard360s');
    }
};
