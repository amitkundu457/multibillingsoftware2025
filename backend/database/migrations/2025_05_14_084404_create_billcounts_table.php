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
        Schema::create('bill_counts', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('created_by');
            $table->integer('bill_count')->default(0);
            $table->timestamps();

            // Foreign key constraint if `users` table is used
            $table->foreign('created_by')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bill_counts');
    }
};
