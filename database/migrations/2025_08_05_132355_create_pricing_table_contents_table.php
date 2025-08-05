<?php

/* database/migrations/2024_01_15_000002_create_pricing_table_contents_table.php */
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('pricing_table_contents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pricing_table_id')
                  ->constrained()
                  ->onDelete('cascade');
            $table->string('service_name');
            $table->longText('description');   // HTML
            $table->boolean('is_safety')->default(false);
            $table->timestamps();
        });
    }
    public function down(): void
    {
        Schema::dropIfExists('pricing_table_contents');
    }
};
