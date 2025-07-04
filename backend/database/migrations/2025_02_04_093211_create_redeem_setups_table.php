<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up():void
    {
        Schema::table('redeem_setups', function (Blueprint $table) {
            if (!Schema::hasColumn('redeem_setups', 'loyalty_id')) {
                $table->unsignedBigInteger('loyalty_id')->nullable()->after('min_invcValue_needed_toStartRedemp');

                $table->foreign('loyalty_id')
                      ->references('id')
                      ->on('loyalties')
                      ->onDelete('set null');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('redeem_setups', function (Blueprint $table) {
            $table->dropForeign(['loyalty_id']);
            $table->dropColumn('loyalty_id');
        });
    }
};
