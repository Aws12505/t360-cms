<?php

// database/migrations/2024_01_09_000002_create_custom_plan_features_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('custom_plan_features', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // dispatch, hr, hiring
            $table->decimal('price', 10, 2);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('custom_plan_features');
    }
};

