<?php

// database/migrations/2024_01_03_000002_create_hero_animated_texts_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('hero_animated_texts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('hero_section_id')->constrained()->onDelete('cascade');
            $table->string('text');
            $table->integer('order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('hero_animated_texts');
    }
};
