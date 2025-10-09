<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ParcelPayment extends Model
{
    //
     protected $fillable = [
        'order_id',
        'customer_id',
        'payment_date',
        'payment_method',
        'amount',
    ];

    public function order()
    {
        return $this->belongsTo(ParcelOrder::class, 'order_id');
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class, 'customer_id');
    }
}
