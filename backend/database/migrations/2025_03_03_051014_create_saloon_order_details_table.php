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
        Schema::create('saloon_order_details', function (Blueprint $table) {
            $table->id(); // Auto-increment primary key
            $table->string('product_name', 255); // Product name (required)
             $table->foreignId('order_id')->constrained()->onDelete('cascade'); // Foreign key (order_id)
            $table->string('product_code', 255)->nullable(); // Product code
            $table->decimal('rate', 10, 2)->nullable(); // Rate
                $table->decimal('total', 10, 0)->nullable(); // Metal value
             $table->decimal('pro_total', 10, 2)->nullable(); // Product total
            $table->string('qty', 100)->nullable(); // Quantity
            $table->decimal('tax_rate', 10, 0)->nullable(); // Tax rate
            $table->string('hsn', 255)->nullable(); // HSN code
               $table->timestamps(); // Created_at & updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('saloon_order_details');
    }
};
