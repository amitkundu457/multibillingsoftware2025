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
        
        Schema::table('product_services', function (Blueprint $table) {
            $table->string('current_stock', 255)->default('0')->after('column_name_here'); // optional: replace 'column_name_here' with an existing column
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('product_services', function (Blueprint $table) {
            $table->dropColumn('current_stock');
        });
    }
};
