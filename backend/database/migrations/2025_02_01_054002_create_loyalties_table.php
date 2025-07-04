<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (!Schema::hasTable('loyalties')) { // Add this check
            Schema::create('loyalties', function (Blueprint $table) {
                $table->id();
                $table->integer('loyalty_balance');
                $table->integer('min_loyalty_required')->nullable();
                $table->decimal('min_bill_to_redeem', 8, 2)->nullable();
                $table->integer('max_loyalty_redeemable')->nullable();
                $table->date('expiry');
                $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('loyalties');
    }
};
