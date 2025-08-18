<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('president_showcases', function (Blueprint $table) {
            $table->id();
            $table->boolean('singleton')->default(true)->unique(); // one row only
            $table->string('name');
            $table->string('role');
            $table->text('description'); // stores HTML
            $table->string('image')->nullable();
            $table->timestamps();
        });

        // seed the single row (ID = 1)
        DB::table('president_showcases')->insert([
            'id'          => 1,
            'singleton'   => true,
            'name'        => 'President Name',
            'role'        => 'President Role',
            'description' => '<p>President description goes here...</p>',
            'image'       => null,
            'created_at'  => now(),
            'updated_at'  => now(),
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('president_showcases');
    }
};
