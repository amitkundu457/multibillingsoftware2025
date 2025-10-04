<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $fillable = [
        'order_id',
        'customer_id',
        'payment_date',
        'payment_method',
        'price',
        'payment_method',
        'created_by'
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function orders(){
        return $this->belongsTo(Order::class,'order_id');
    }
}
