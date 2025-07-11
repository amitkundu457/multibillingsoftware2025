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
        if (!Schema::hasTable('purchasereturns')) {  // Prevent duplicate table creation
            Schema::create('purchasereturns', function (Blueprint $table) {
                $table->id();
                $table->string('supplier_name');
                $table->date('date');
                $table->string('reference_no');
                $table->timestamps();
                $table->string('status')->nullable();
            });
        }
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('purchasereturns');
    }
};
