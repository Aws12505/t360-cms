<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('driver_positions', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->string('status')->default('draft'); // draft | published | closed
            $table->boolean('is_featured')->default(false);
            $table->integer('order')->default(0);

            // Content
            $table->string('summary', 300)->nullable();
            $table->longText('content')->nullable(); // HTML from QuillEditorAdvanced
            $table->string('cover_image')->nullable();

            // Job details
            $table->string('employment_type')->default('FULL_TIME'); // FULL_TIME | PART_TIME | CONTRACTOR | TEMPORARY
            $table->string('route_type')->nullable();                 // Local | Regional | OTR | Dedicated
            $table->string('home_time')->nullable();
            $table->string('schedule')->nullable();
            $table->string('equipment')->nullable();

            // Pay (pay_unit limited to the units Google JobPosting accepts)
            $table->decimal('pay_min', 10, 2)->nullable();
            $table->decimal('pay_max', 10, 2)->nullable();
            $table->string('pay_unit')->nullable(); // HOUR | DAY | WEEK | MONTH | YEAR
            $table->string('pay_display')->nullable(); // free-text override, e.g. "$0.68–0.72 CPM"
            $table->string('pay_currency', 3)->default('USD');

            // Structured lists
            $table->json('locations')->nullable();    // [{city, state, postal_code, street}]
            $table->json('requirements')->nullable(); // ["..."]
            $table->json('benefits')->nullable();     // ["..."]
            $table->json('highlights')->nullable();   // [{label, value}]

            // Dates
            $table->date('date_posted')->nullable();
            $table->date('valid_through')->nullable();

            // SEO overrides
            $table->string('seo_title')->nullable();
            $table->string('seo_description', 320)->nullable();
            $table->string('og_image')->nullable();

            $table->timestamps();
            $table->softDeletes();

            $table->index(['status', 'order']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('driver_positions');
    }
};
