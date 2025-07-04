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
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->date('entry_date');
            $table->string('booking_no')->unique();
            $table->date('booking_date');
            $table->string('phone');
            $table->string('customer_name');
            $table->text('address');
            $table->string('source')->nullable();
            $table->boolean('out_of_salon')->default(false);
            $table->decimal('rate', 10, 2);
            $table->decimal('discount', 10, 2)->default(0);
            $table->decimal('total_price', 10, 2);
            $table->decimal('cash_payment', 10, 2)->default(0);
            $table->decimal('card_payment', 10, 2)->default(0);
            $table->decimal('upi_payment', 10, 2)->default(0);
            $table->decimal('coupon_amount', 10, 2)->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};
