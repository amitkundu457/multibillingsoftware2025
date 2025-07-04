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
        Schema::create('saloon_payments', function (Blueprint $table) {
            $table->id(); // Auto-increment primary key
            $table->foreignId('order_id')->constrained('saloon_orders');
            $table->foreignId('customer_id')->constrained('users');
            $table->date('payment_date'); // Payment date field
            $table->string('payment_method', 100)->nullable(); // Payment method
            $table->decimal('price', 10, 0)->nullable(); // Decimal field for price
            $table->timestamps(); // Created_at & updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('saloon_payments');
    }
};
