<?php

namespace App\Models;
use App\Models\KotTable;


use Illuminate\Database\Eloquent\Model;

class KotTable extends Model
{
    //

    protected $fillable = ['table_no', 'status','created_by'];


    public function bookings()
    {
        return $this->belongsToMany(FamilyBooking::class, 'family_booking_kot_table', 'kot_table_id', 'family_booking_id');
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    public function bills()
    {
        return $this->hasMany(Bill::class);
    }

}
