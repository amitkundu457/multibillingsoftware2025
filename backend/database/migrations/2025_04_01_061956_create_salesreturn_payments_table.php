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
        Schema::create('salesreturn_payments', function (Blueprint $table) {
            $table->id();
            $table->enum('payment_type', ['Cash', 'Bank Transfer', 'Card'])->default('Cash');
            $table->unsignedBigInteger('sales_return_id');
            $table->decimal('amount', 10, 2);
            $table->text('payment_note')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('salesreturn_payments', function (Blueprint $table) {
            $table->enum('payment_type', ['Account', 'None'])->default('None')->change();
        });    }
};
