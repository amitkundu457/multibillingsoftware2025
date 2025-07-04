<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{

    public function up(): void
    {
        Schema::create('selected_products', function (Blueprint $table) {
            $table->id();
            $table->string('productName');
            $table->decimal('productPrice', 10, 2);
            $table->integer('quantity');
            $table->timestamps();
        });
    }



    public function down(): void
    {
        Schema::dropIfExists('selected_products');
    }
};
