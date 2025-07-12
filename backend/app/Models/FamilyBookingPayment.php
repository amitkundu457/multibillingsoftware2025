<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FamilyBookingPayment extends Model
{
    //
    protected $fillable = [
        'family_booking_id',
        'payment_method',
        'amount',
        'payment_date',
        'created_by',
    ];
}
