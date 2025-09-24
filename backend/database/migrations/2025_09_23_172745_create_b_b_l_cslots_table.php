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
        Schema::create('b_b_l_cslots', function (Blueprint $table) {
            $table->id();
            // $table->foreignId('template_id')->constrained('reminder_templates')->cascadeOnDelete();
            $table->string('name')->nullable();
            $table->json('days')->comment('Array of day numbers in month, e.g. [2,15,20,25]');
            $table->string('target')->default('lost_customers'); // can add groups later
            $table->time('send_time')->default('10:00:00'); // time of day to send (HH:MM:SS)
            $table->boolean('enabled')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('b_b_l_cslots');
    }
};
