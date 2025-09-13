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
        Schema::create('advance_message_dates', function (Blueprint $table) {
            $table->id();
            $table->integer('birthdayAdvance')->nullable();
            $table->integer('anniversaryAdvance')->nullable();
            $table->integer('bblcAdvanceDate')->nullable();
            $table->integer('reminderAdvanceDate')->nullable();
            $table->unsignedBigInteger('created_by');
            $table->foreign('created_by')->references('id')->on('users')->onDelete('cascade');
            $table->timestamps();
        });


    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('advance_message_dates')) {
            Schema::table('advance_message_dates', function (Blueprint $table) {
                $table->dropForeign(['created_by']);
            });
        }

         Schema::dropIfExists('advance_message_dates');

    }
};
