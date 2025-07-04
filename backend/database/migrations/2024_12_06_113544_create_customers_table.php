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
        Schema::create('customers', function (Blueprint $table) {
            $table->id(); // Primary Key
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Foreign key to Users table
            $table->string('phone'); // Phone number
            $table->string('customer_type'); // Customer type
            $table->string('customer_sub_type')->nullable(); // Customer subtype
            $table->date('dob')->nullable(); // Date of Birth
            $table->date('anniversary')->nullable(); // Date of Anniversary
            $table->string('gender')->nullable(); // Gender
            $table->text('address'); // Address
            $table->string('pincode'); // Pincode
            $table->string('state'); // State
            $table->string('country'); // Country
            $table->timestamps(); // Created_at and Updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('customers');
    }
};
