<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('hiring_settings', function (Blueprint $table) {
            $table->id();
            $table->boolean('singleton')->default(true)->unique(); // one row only

            // New-application notification to the team
            $table->boolean('notify_enabled')->default(true);
            $table->json('notification_emails')->nullable();
            $table->string('admin_subject')->nullable();

            // Confirmation sent to the applicant
            $table->boolean('confirmation_enabled')->default(true);
            $table->string('confirmation_subject')->nullable();
            $table->text('confirmation_body')->nullable(); // HTML, supports {first_name} {last_name} {positions}
            $table->string('reply_to')->nullable();

            $table->timestamps();
        });

        DB::table('hiring_settings')->insert([
            'id'                   => 1,
            'singleton'            => true,
            'notify_enabled'       => true,
            'notification_emails'  => json_encode(['hiring@trucking360solutions.com']),
            'admin_subject'        => 'New driver application: {first_name} {last_name}',
            'confirmation_enabled' => true,
            'confirmation_subject' => 'We received your application, {first_name}',
            'confirmation_body'    => '<p>Hi {first_name},</p><p>Thanks for applying to drive with Trucking 360. We received your application for: <strong>{positions}</strong>.</p><p>Someone from our team will reach out to you within <strong>2 business days</strong>. If you have questions in the meantime, just reply to this email.</p><p>Talk soon,<br>The Trucking 360 Hiring Team</p>',
            'reply_to'             => 'hiring@trucking360solutions.com',
            'created_at'           => now(),
            'updated_at'           => now(),
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('hiring_settings');
    }
};
