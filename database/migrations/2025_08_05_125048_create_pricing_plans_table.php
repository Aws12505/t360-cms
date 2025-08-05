<?php

// database/migrations/2024_01_09_000001_create_pricing_plans_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pricing_plans', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->decimal('total_value', 10, 2)->nullable(); // nullable for custom plans
            $table->string('per_text')->nullable(); // month/year/whatever
            $table->longText('description'); // html editor
            $table->text('features')->nullable(); // small text
            $table->boolean('is_customizable')->default(false);
            $table->boolean('is_best_value')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pricing_plans');
    }
};
