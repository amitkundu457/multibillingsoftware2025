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
        Schema::create('staff', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('contact_number')->nullable();
            $table->string('address');
            $table->string('email')->unique();
            $table->foreignId('designations_names_id');
            $table->string("category")->nullable();
            $table->string("category_type")->nullabe();


            $table->foreignId('user_id')->unique();
            $table->string("created_by")->nullable();

            $table->date('joinning_date');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('staff');
    }
};
