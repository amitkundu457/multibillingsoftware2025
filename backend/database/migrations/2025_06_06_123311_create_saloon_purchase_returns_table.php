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
        Schema::create('saloon_purchase_returns', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('customer_name');
            $table->date('date');
            $table->string('reference_no');
            $table->string('reason');
            $table->timestamps(); // includes created_at & updated_at
            $table->string('status')->nullable();
            $table->integer('created_by');
            $table->string('quantity')->nullable();
            $table->unsignedBigInteger('product_service_id')->nullable();

            $table->foreign('product_service_id')->references('id')->on('product_services')->onDelete('set null');
       
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('saloon_purchase_returns');
    }
};
