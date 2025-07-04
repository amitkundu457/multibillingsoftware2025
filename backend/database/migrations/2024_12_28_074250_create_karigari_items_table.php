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
        Schema::create('karigari_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('karigari_id')->constrained('karigaris')->cascadeOnDelete();
            $table->string('product_name');
            $table->decimal('nwt',10,2)->default(0);
            $table->decimal('pcs',10,2)->default(0);
            $table->decimal('tounch',10,2)->default(0);
            $table->decimal('rate',10,2)->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('karigari_items');
    }
};
