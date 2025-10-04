<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Request;

class Order extends Model
{
    protected $fillable = [
        'billno',
        'gross_total',
        'discount',
        'total_price',
        'customer_id',
        'created_by',
        'date',
        'bill_inv',
        'order_slip',
        'salesman_id',
        'stylist_id',
        'discountPercent',
        'discountRs',
        'additionRS',
        'additionDetail',
        'totalqty',
        'totalTax',
        "advanceAmount",
        'adjustAmount',
        'minAdjAmt',
        'minAdAmt',
        'billcountnumber',
        'depositeMaterial'
        
    ];

    public function details()
    {
        return $this->hasMany(OrderDetails::class);
    }

    public function users()
{
    return $this->belongsTo(User::class, 'customer_id');
}
public function payments(){
    return $this->hasMany(Payment::class,'order_id');
}




}
