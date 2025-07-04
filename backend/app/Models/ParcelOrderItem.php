<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ParcelOrderItem extends Model
{
    //
     protected $fillable = ['parcel_order_id', 'product_id', 'quantity', 'product_price','tax_rate', 'kot_generated'];

    public function product()
    {
        return $this->belongsTo(ProductService::class);
    }

    public function order()
    {
        return $this->belongsTo(ParcelOrder::class);
    }
}
