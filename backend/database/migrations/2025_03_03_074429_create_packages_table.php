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
        Schema::create('packages', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->foreignId('type_id');
            $table->foreignId('subtype_id');
            $table->decimal('price',10,2);
            $table->foreignId('tax_id');
            $table->foreignId('tax_id_ex');
            // $table->foreignId('tax_id');
            $table->string('hsn');
            $table->foreignId('group_id');
            $table->foreignId('category_id');
            $table->foreignId('service_type_id');
            $table->foreignId('created_by');
            $table->string('nos');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('packages');
    }
};
