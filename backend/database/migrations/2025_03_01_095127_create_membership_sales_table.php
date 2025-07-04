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
        Schema::create('membership_sales', function (Blueprint $table) {
            $table->id();
            $table->foreignId('customer_id');
            $table->foreignId('plan_id');
            $table->foreignId('stylist_id');
            $table->date('sale_date');
            $table->decimal('amount', 10, 2);
            $table->integer('payment_method');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('membership_sales');
    }
};
