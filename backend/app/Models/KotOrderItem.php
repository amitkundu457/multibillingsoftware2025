<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class KotOrderItem extends Model
{
    //
    protected $fillable = [
       'kot_table_id', 'kot_order_id', 'tax_rate','product_id', 'quantity', 'product_price','kot_generated','family_booking_id'
    ];

    public function product()
    {
        return $this->belongsTo(ProductService::class,'product_id');
    }
    public function table()
    {
        return $this->belongsTo(KotTable::class);
    }
}
