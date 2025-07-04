<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ParcelBill extends Model
{
    //
     protected $fillable = ['parcel_order_id', 'subtotal', 'gst', 'grand_total','created_by'];

    public function order()
    {
        return $this->belongsTo(ParcelOrder::class);
    }
}
