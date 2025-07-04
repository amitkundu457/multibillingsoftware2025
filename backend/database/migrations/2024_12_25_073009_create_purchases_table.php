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
        Schema::create('purchases', function (Blueprint $table) {
            $table->id();
            $table->string('voucher_no');
            $table->date('date');
            $table->string('bill_no');
            $table->boolean('is_igst')->default(0);
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('payment_mode')->default('cash');
            $table->integer('credit_days')->default(0);
            $table->integer('discount')->default(0);
            $table->integer('credit_note')->default(0);
            $table->integer('addition')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('purchases');
    }
};
