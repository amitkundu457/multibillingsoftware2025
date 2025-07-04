<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FamilyBooking extends Model
{
    //
     protected $table = 'family_bookings';

    protected $fillable = ['customer_name', 'members_count','customer_id','created_by'];

    public function tables()
    {
        return $this->belongsToMany(KotTable::class, 'family_booking_kots', 'family_booking_id', 'kot_table_id');
    }

     public function items()
    {
        return $this->hasMany(KotOrderItem::class, 'family_booking_id');
    }

     public function user()
{
    return $this->belongsTo(User::class, 'customer_id');
}

public function createdBy()
{
    return $this->belongsTo(User::class, 'created_by');
}
}
