<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// return new class extends Migration
// {
//     /**
//      * Run the migrations.
//      */
//     public function up(): void
//     {
//         Schema::create('coni_purchases', function (Blueprint $table) {
//             $table->id();
//             $table->integer('coins');
//             $table->foreignId('created_by')->constrained('users');
//             $table->decimal('amount', 8, 2);
//             $table->string('payment_method'); // 'cash' or 'online'
//             $table->timestamps();
//         });
//     }

//     /**
//      * Reverse the migrations.
//      */
//     public function down(): void
//     {
//         Schema::dropIfExists('coni_purchases');
//     }

// };




return new class extends Migration
{
    public function up(): void
    {
        Schema::table('coni_purchases', function (Blueprint $table) {
            // Drop the existing foreign key constraint
            $table->dropForeign(['created_by']);

            // Re-add with ON DELETE CASCADE
            $table->foreign('created_by')
                ->references('id')
                ->on('users')
                ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::table('coni_purchases', function (Blueprint $table) {
            // Drop the cascade constraint
            $table->dropForeign(['created_by']);

            // Re-add original foreign key without cascade
            $table->foreign('created_by')
                ->references('id')
                ->on('users');
        });
    }
};

