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
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('billno');
            $table->string('salesperson_id')->nullable();
            $table->date('date')->nullable();
            $table->decimal('gross_total')->nullable();
            $table->decimal('discount')->nullable();
            $table->decimal('total_price')->nullable();
            $table->foreignId('created_by')->constrained('users');
            $table->foreignId('customer_id')->constrained('users');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
