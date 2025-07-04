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
        Schema::create('account_masters', function (Blueprint $table) {
            $table->id();
            $table->string('account_name');
            $table->string('gstin');
            $table->integer('phone');
            $table->foreignId('account_group_id');
            $table->string('city');
            $table->string('state');
            $table->string('contact_person');
            $table->integer('blance');
            $table->boolean('status');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('account_masters');
    }
};
