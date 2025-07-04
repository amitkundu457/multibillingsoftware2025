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
        Schema::create('saloon_orders', function (Blueprint $table) {
            $table->id(); // Auto-increment primary key
            $table->string('billno', 255); // Bill number (required)
            $table->string('salesperson_id', 255)->nullable(); // Salesperson ID (nullable)
            $table->date('date')->nullable(); // Date (nullable)
            $table->decimal('gross_total', 8, 2)->nullable(); // Gross total
            $table->decimal('discount', 8, 2)->nullable(); // Discount amount
            $table->decimal('total_price', 8, 2)->nullable(); // Total price after discount
            $table->foreignId('created_by')->constrained('users');
            $table->foreignId('customer_id')->constrained('users');
            $table->integer('bill_inv')->default(0); // Bill invoice flag (default 0)
            $table->integer('order_slip')->nullable(); // Order slip number
            $table->integer('salesman_id')->nullable(); // Salesman ID
            $table->integer('stylist_id')->nullable(); // Stylist ID
            $table->timestamps(); // Created_at & updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('saloon_orders');
    }
};
