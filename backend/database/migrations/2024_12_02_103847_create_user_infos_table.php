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
        Schema::create('user_infos', function (Blueprint $table) {
            $table->id(); // Primary key
            $table->string('mobile_number', 10); // Mobile number with a max length of 10
            $table->string('email')->unique(); // Email (unique constraint added)
            $table->string('first_name', 100); // First Name (non-nullable, length 100)
            $table->string('last_name', 100); // Last Name (non-nullable, length 100)
            $table->string('category'); // Category
            $table->string('business_name'); // Business Name
            $table->text('address_1'); // Address 1
            $table->text('address_2')->nullable(); // Address 2 (nullable)
            $table->string('landmark')->nullable(); // Landmark (nullable)
            $table->string('pincode', 10); // Pincode with a max length of 10
            $table->string('country', 255); // Country
            $table->string('state', 255); // State
            $table->string('city', 255); // City
            $table->boolean('agreed_to_terms')->default(false); // Terms and Conditions
            $table->string('password'); // Password field (hashed password)
            $table->timestamps(); // Created and Updated timestamps
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_infos');
    }
};
