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
        Schema::create('user_information', function (Blueprint $table) {
            $table->id();
            $table->string('mobile_number'); 
            $table->string('email'); // Email *
            $table->string('first_name', 100)->nullable(false); // First Name * (non-nullable, length 100)
            $table->string('last_name', 100)->nullable(false); // Last Name * (non-nullable, length 100)
            $table->string('category'); // Category *
            $table->string('business_name'); // Business Name *
            $table->text('address_1'); // Address 1 *
            $table->text('address_2')->nullable(); // Address 2
            $table->string('landmark')->nullable(); // Landmark
            $table->string('pincode'); // Pincode
            $table->string('country'); // Country *
            $table->string('state'); // State *
            $table->string('city'); // City *
            $table->boolean('agreed_to_terms')->default(false); // Terms and Conditions
            $table->string('password'); // Password field (hashed password)
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_information');
    }
};
