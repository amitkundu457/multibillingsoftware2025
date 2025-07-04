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
        Schema::create('barcodes', function (Blueprint $table) {
            $table->id();
            $table->string('barcode_no');
            $table->string('sku');
            $table->string('itemno');
            $table->unsignedBigInteger('item_id');
            $table->unsignedBigInteger('brand_id');
            $table->unsignedBigInteger('purity_id'); 
            $table->string('huid');
            $table->integer('gwt');
            $table->integer('nwt');
            $table->string('design');
            $table->integer('pcs');
            $table->unsignedBigInteger('supplier_id');
            $table->string('bill_number');
            $table->string('image');
            $table->string('basic_rate');
            $table->string('purchase_rates');
            $table->string('mrp');
            $table->string('sale_rate');
            $table->integer('gm');
            $table->decimal('diamond_value',8,2);
            $table->string('diamond_details');
            $table->string('stone_details');
            $table->integer('stone_value');
            $table->unsignedBigInteger('created_by');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('barcodes');
    }
};
