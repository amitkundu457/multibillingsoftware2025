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
        Schema::create('software_commissions', function (Blueprint $table) {
            $table->id();
            $table->integer('user_id');
            $table->integer('user_information_id');
            $table->decimal('commission',10,2)->default(0);
            $table->decimal('total_amount',10,2)->default(0);
            $table->string('software_type')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('software_commissions');
    }
};
