<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('missions', function (Blueprint $table) {
            $table->id();
            $table->boolean('singleton')->default(true)->unique(); // one row only
            $table->text('text'); // large text for mission
            $table->timestamps();
        });

        // seed the single row (ID = 1)
        DB::table('missions')->insert([
            'id' => 1,
            'singleton' => true,
            'text' => 'Our mission statement goes here... please update this text.',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('missions');
    }
};
