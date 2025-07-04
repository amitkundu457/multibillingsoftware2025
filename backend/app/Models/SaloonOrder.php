<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SaloonOrder extends Model
{
    //
    protected $fillable = [
        'billno',
        'salesperson_id',
        'date',
        'gross_total',
        'discount',
        'total_price',
        'created_by',
        'customer_id',
        'bill_inv',
        'order_slip',
        'salesman_id',
        'stylist_id',
        'printStatus_id',
        'totaltax',
        'membDiscount',
        'usingLoyaltyPoints',
        'totalDiscount'
    ];
    public function saloonDetails()
    {
        return $this->hasMany(SaloonOrderDetails::class);
    }

    public function users()
    {
        return $this->belongsTo(User::class, 'customer_id');
    }
    public function saloonPayments(){
        return $this->hasMany(SaloonPayment::class,'order_id');
    }

}
