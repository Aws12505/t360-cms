<?php
// database/migrations/2024_XX_XX_XXXXXX_add_button_and_highlight_fields_to_pricing_plans.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('pricing_plans', function (Blueprint $table) {
            $table->string('button_link')->nullable();
            $table->string('button_text')->nullable();
            $table->longText('highlighted_text')->nullable(); // HTML content
            $table->string('button_bg_color', 7)->nullable(); // hex color #FFFFFF
            $table->string('total_value_bg_color', 7)->nullable(); // hex color #FFFFFF
        });
    }

    public function down(): void
    {
        Schema::table('pricing_plans', function (Blueprint $table) {
            $table->dropColumn([
                'button_link',
                'button_text',
                'highlighted_text',
                'button_bg_color',
                'total_value_bg_color'
            ]);
        });
    }
};
