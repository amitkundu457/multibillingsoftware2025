<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FamilyBookingKot extends Model
{
    //
        protected $table = 'family_booking_kots'; // Name of your pivot table

         protected $fillable = [
        'family_booking_id',
        'kot_table_id',
    ];

     public function familyBooking()
    {
        return $this->belongsTo(FamilyBooking::class, 'family_booking_id');
    }

     public function kotTable()
    {
        return $this->belongsTo(KotTable::class, 'kot_table_id');
    }


}
