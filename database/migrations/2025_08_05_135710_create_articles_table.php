<?php

/* database/migrations/2024_01_16_000002_create_articles_table.php */
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('articles', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description');
            $table->string('featured_image')->nullable();
            $table->date('custom_date')->nullable();
            $table->longText('content');
            $table->boolean('is_active')->default(false);
            $table->timestamps();
        });
    }
    public function down(): void
    {
        Schema::dropIfExists('articles');
    }
};

