<?php

// database/migrations/2024_01_08_000001_create_form_sections_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('form_sections', function (Blueprint $table) {
            $table->id();
            $table->boolean('singleton')->default(true)->unique();   // one row only
            $table->string('title');
            $table->longText('description'); // html editor
            $table->timestamps();
        });

        // seed the single row (ID = 1)
        DB::table('form_sections')->insert([
            'id'          => 1,
            'singleton'   => true,
            'title'       => 'Contact Form',
            'description' => '<p>Get in touch with us…</p>',
            'created_at'  => now(),
            'updated_at'  => now(),
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('form_sections');
    }
};
