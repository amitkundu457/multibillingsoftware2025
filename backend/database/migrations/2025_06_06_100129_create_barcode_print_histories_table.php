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
      Schema::create('barcode_print_histories', function (Blueprint $table) {
    $table->id();
    $table->unsignedInteger('product_id');  // Change this line
    $table->unsignedBigInteger('barcode_id');
    $table->unsignedBigInteger('printed_by')->nullable();
    $table->timestamp('printed_at')->nullable();
    $table->timestamps();

    $table->foreign('product_id')->references('id')->on('product_services')->onDelete('cascade');
    $table->foreign('barcode_id')->references('id')->on('barcodes')->onDelete('cascade');
    $table->foreign('printed_by')->references('id')->on('users')->onDelete('set null');
});

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('barcode_print_histories');
    }
};
