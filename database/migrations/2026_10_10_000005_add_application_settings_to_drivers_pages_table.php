<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    private const OLD_EMPTY_STATE = "We don't have a listed opening right now, but our partners hire all the time. Send us your details and a recruiter will reach out when a route that fits opens up.";

    public function up(): void
    {
        Schema::table('drivers_pages', function (Blueprint $table) {
            // When there are no open positions: allow general applications, or close the form entirely
            $table->boolean('accept_general_applications')->default(true)->after('empty_state');
            $table->text('closed_message')->nullable()->after('accept_general_applications');
        });

        DB::table('drivers_pages')->where('id', 1)->update([
            'closed_message' => 'There are no open positions right now and we are not accepting applications. Please check back soon.',
        ]);

        // Replace the original default wording (leave it alone if someone already edited it)
        DB::table('drivers_pages')->where('id', 1)->where('empty_state', self::OLD_EMPTY_STATE)->update([
            'empty_state' => "There are no open positions right now, but you can fill out an application for the work you're interested in and we will contact you when something becomes available.",
        ]);
    }

    public function down(): void
    {
        Schema::table('drivers_pages', function (Blueprint $table) {
            $table->dropColumn(['accept_general_applications', 'closed_message']);
        });
    }
};
