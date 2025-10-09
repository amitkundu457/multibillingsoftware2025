<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;


class KotBill extends Model
{
    //
     use HasFactory;

    protected $fillable = [
        'family_booking_id',
        'customer_name',
         'tables',
        'subtotal',
        'gst',
        'grand_total',
        'created_by',
        'customer_id'
    ];

    protected $casts = [
        'tables' => 'array',
    ];
}
