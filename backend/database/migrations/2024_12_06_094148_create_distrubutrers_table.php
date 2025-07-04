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
        Schema::create('distrubutrers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users');
            // $table->foreignId('user_id')->constrained('users');
            $table->string('company_name');
            $table->string('company_logo');
            $table->string('address');
            $table->string('phone');
            $table->string('website');
            $table->string('email');
            $table->string('pan_number');
            $table->string('gst_number');
            $table->string('ifsc_code');
            $table->string('bank_name');
            $table->string('account_number');
            $table->string('account_holder_name');
            $table->string('account_type');
            $table->string('status'); // active, inactive, deleted
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('distrubutrers');
    }
};
