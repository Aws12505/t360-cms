<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('driver_applications', function (Blueprint $table) {
            $table->id();
            $table->string('first_name');
            $table->string('last_name');
            $table->string('email');
            $table->string('phone', 40);
            $table->string('availability')->nullable();
            $table->boolean('has_cdl_a')->default(false);
            $table->string('experience_years')->nullable(); // "<1" | "1-2" | "3-5" | "5+"

            $table->string('status')->default('new'); // new | contacted | hired | not_a_fit
            $table->timestamp('read_at')->nullable();

            // Where the application came from
            $table->foreignId('source_position_id')->nullable()->constrained('driver_positions')->nullOnDelete();
            $table->string('source_url', 500)->nullable();
            $table->json('utm')->nullable();
            $table->string('ip', 45)->nullable();
            $table->string('user_agent', 500)->nullable();

            $table->timestamps();
            $table->softDeletes();

            $table->index(['status', 'created_at']);
            $table->index('email');
        });

        // Preferred positions (multi-select). The title is snapshotted so it
        // survives the position being renamed or deleted later.
        Schema::create('driver_application_position', function (Blueprint $table) {
            $table->id();
            $table->foreignId('driver_application_id')->constrained()->cascadeOnDelete();
            $table->foreignId('driver_position_id')->nullable()->constrained()->nullOnDelete();
            $table->string('position_title');
            $table->timestamps();
        });

        // Timeline: notes, status changes and emails sent
        Schema::create('driver_application_notes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('driver_application_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('type')->default('note'); // note | status_change | email
            $table->text('body');
            $table->json('meta')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('driver_application_notes');
        Schema::dropIfExists('driver_application_position');
        Schema::dropIfExists('driver_applications');
    }
};
