<?php

// database/migrations/2024_01_09_000003_create_custom_feature_pricing_plan_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('custom_feature_pricing_plan', function (Blueprint $table) {
    $table->id();
    $table->foreignId('pricing_plan_id')->constrained()->onDelete('cascade');
    $table->foreignId('custom_plan_feature_id')->constrained()->onDelete('cascade');

    // shorter explicit index name fixes the error ↓
    $table->unique(
        ['pricing_plan_id', 'custom_plan_feature_id'],
        'plan_feature_unique'
    );

    $table->timestamps();
});
    }

    public function down(): void
    {
        Schema::dropIfExists('custom_feature_pricing_plan');
    }
};
