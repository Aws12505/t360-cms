<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('why_choose_us_features', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description');
            $table->string('icon')->nullable();
            $table->integer('order')->default(0);
            $table->timestamps();
        });

        // seed the current static feature cards
        $now = now();
        DB::table('why_choose_us_features')->insert([
            [
                'title'       => 'Reliability',
                'description' => "We guarantee that your loads are managed efficiently, meeting Amazon's strict schedules and safety standards on every trip.",
                'icon'        => null,
                'order'       => 0,
                'created_at'  => $now,
                'updated_at'  => $now,
            ],
            [
                'title'       => 'Cost Efficiency',
                'description' => 'Through optimized dispatching and proactive planning, we help you keep costs down while maintaining the highest level of service.',
                'icon'        => null,
                'order'       => 1,
                'created_at'  => $now,
                'updated_at'  => $now,
            ],
            [
                'title'       => 'Safety-Driven Focus',
                'description' => 'Our expert safety team offers detailed reports and guidance, helping to minimize violations and protect your drivers and business reputation.',
                'icon'        => null,
                'order'       => 2,
                'created_at'  => $now,
                'updated_at'  => $now,
            ],
            [
                'title'       => 'Customized Solutions',
                'description' => "We understand that every AFP has unique needs. Our flexible solutions are designed to your specific goals, ensuring alignment with Amazon's high expectations.",
                'icon'        => null,
                'order'       => 3,
                'created_at'  => $now,
                'updated_at'  => $now,
            ],
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('why_choose_us_features');
    }
};
