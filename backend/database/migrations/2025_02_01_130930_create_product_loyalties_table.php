<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        if (!Schema::hasTable('productloyalties')) { // Check if table already exists
            Schema::create('productloyalties', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('product_service_id');
                $table->unsignedBigInteger('loyalty_id');
                $table->timestamps();

                $table->foreign('product_service_id')->references('id')->on('product_services')->onDelete('cascade');
                $table->foreign('loyalty_id')->references('id')->on('loyalties')->onDelete('cascade');
            });
        }
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_loyalties');
    }
};
