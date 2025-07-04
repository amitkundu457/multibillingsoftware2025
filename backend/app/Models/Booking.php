<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;


class Booking extends Model
{
    //
    use HasFactory;

    protected $fillable = [
        'entry_date',
        'booking_no',
        'booking_date',
        'booking_time',
        'phone',
        'customer_name',
        'address',
        'source',
        'out_of_salon',
        'rate',
        'discount',
        'total_price',
        'cash_payment',
        'card_payment',
        'upi_payment',
        'coupon_amount',
        'service',
        'created_by'
    ];
}
