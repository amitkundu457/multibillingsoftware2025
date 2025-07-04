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
        Schema::create('product_services', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('type');
            $table->string('code')->unique();
            $table->string('company_id');
            $table->string('group_id');
            $table->string('rate_type');
            $table->string('image');
            $table->decimal('rate', 10, 2);
            $table->decimal('mrp', 10, 2)->nullable();
            $table->decimal('staff_commission', 10, 2)->nullable();
            $table->string('gst_input')->nullable();
            $table->string('gst_output')->nullable();
            $table->string('hsn')->nullable();
            $table->boolean('stock_maintain')->default(false);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_services');
    }
};
