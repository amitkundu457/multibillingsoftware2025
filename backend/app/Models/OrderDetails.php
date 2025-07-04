<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrderDetails extends Model
{
    protected $fillable = [
        'order_id',        // Foreign key to the orders table
        'product_name',    // Name of the product
        'product_code',    // Code of the product
        'gross_weight',    // Gross weight of the product
        'net_weight',      // Net weight of the product
        'making',          // Making charge for the product
        'rate',            // Rate of the product
        'stone_weight',    // Stone weight of the product
        'stone_value',     // Value of the stone in the product
        'huid',
        'tax_rate',           // HUID of the product (optional)
        'hallmark',        // Hallmark of the product (optional)
        'making_dsc',        // Hallmark of the product (optional)
        'metal_value',        // Hallmark of the product (optional)
        'pro_total',        // Hallmark of the product (optional)
        'grm',        // Hallmark of the product (optional)
        'hsn',
        'hallmarkCharge',
        'wastageCharge',
        'makingInRs',
        'product_id',
        'diamondDetails',
        'diamondValue',
        'qty',
        'otherCharge',
        'description',
        'making_gst_percentage',
        'ad_wgt',
        'gstOnGold',
        'gstOnMaking',
        'mkg_chg_RS_P'



    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}
