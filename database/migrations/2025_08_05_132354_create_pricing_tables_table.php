<?php

/* database/migrations/2024_01_15_000001_create_pricing_tables_table.php */
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('pricing_tables', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->timestamps();
        });
    }
    public function down(): void
    {
        Schema::dropIfExists('pricing_tables');
    }
};
