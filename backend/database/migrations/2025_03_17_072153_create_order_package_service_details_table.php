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
        Schema::create('order_package_service_details', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('order_package_id')->unsigned();
            $table->bigInteger('service_id')->unsigned();
            $table->string('service_name');
            $table->decimal('price', 10, 2);
            $table->integer('quantity');
            $table->decimal('additional_charge', 10, 2)->nullable();
            $table->string('stylist_name')->nullable();
            $table->decimal('subtotal', 10, 2);
            $table->timestamps();


        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_package_service_details');
    }
};
