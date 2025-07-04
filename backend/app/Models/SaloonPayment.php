<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SaloonPayment extends Model
{
    //
    protected $fillable = [
        'order_id',
        'customer_id',
        'payment_date',
        'payment_method',
        'price',
        'created_by'
    ];

    public function saloonOrder()
    {
        return $this->belongsTo(Order::class);
    }
    public function saloonOrders(){
        return $this->belongsTo(SaloonOrder::class,'order_id');
    }
}
