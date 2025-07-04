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
            $table->bigIncrements('id');
            $table->string('voucher_no');
            $table->date('date');
            $table->string('bill_no');
            $table->boolean('is_igst')->default(0);

            $table->unsignedBigInteger('user_id'); // Foreign key to users table
            $table->string('payment_mode')->default('cash');
            $table->integer('credit_days')->default(0);
            $table->integer('discount')->default(0);
            $table->integer('credit_note')->default(0);
            $table->integer('addition')->default(0);

            $table->timestamps(); // created_at and updated_at

            $table->unsignedBigInteger('created_by');
            $table->unsignedBigInteger('product_service_id')->nullable();
            $table->string('product_name', 100)->nullable();

            // Foreign Key Constraints
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('product_service_id')->references('id')->on('product_services')->onDelete('set null');
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
