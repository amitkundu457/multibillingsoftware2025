<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SaloonOrderDetails extends Model
{
    //
    protected $fillable = [
        'product_name',
        'order_id',
        'product_code',
        'rate',
        'total',
        'pro_total',
        'qty',
        'tax_rate',
        'hsn',
        'product_id'
    ];

    public function saloonOrder()
    {
        return $this->belongsTo(SaloonOrder::class);
    }
}
