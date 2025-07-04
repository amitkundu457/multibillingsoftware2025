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
        Schema::create('saloon_purchase_return_payments', function (Blueprint $table) {
            $table->id();

            $table->decimal('amount', 10, 2);
            $table->string('payment_type');
            // $table->unsignedBigInteger('sales_return_id')->nullable(); // Optional if needed
            $table->unsignedBigInteger('purchase_return_id'); // Required

            $table->text('payment_note')->nullable();
            $table->timestamps();

            // ✅ Add foreign key for saloon_purchase_returns
            $table->foreign('purchase_return_id')
                  ->references('id')
                  ->on('saloon_purchase_returns')
                  ->onDelete('cascade'); // or 'set null' if nullable
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('saloon_purchase_return_payments');
    }
};
