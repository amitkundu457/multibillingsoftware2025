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
        Schema::create('package_assigns', function (Blueprint $table) {
            $table->id();
            $table->string('package_no')->unique();
        $table->string('receipt_no')->unique();
        $table->string('package_name');
        $table->decimal('package_amount', 10, 2);
        $table->decimal('service_amount', 10, 2);
        $table->decimal('paid_amount', 10, 2);
        $table->decimal('balance_amount', 10, 2);
        $table->decimal('remaining_amount', 10, 2);
        $table->decimal('receipt_amount', 10, 2);
        $table->date('payment_date');
        $table->date('package_booking');
        $table->date('package_expiry');
        $table->string('settlement_mode'); // No ENUM, using string
        $table->string('payment_status'); // No ENUM, using string
        $table->string('package_status'); // No ENUM, using string
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('package_assigns');
    }
};
