<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Barcode extends Model
{

    protected $fillable = [
        'barcode_no', 'sku', 'itemno', 'item_id', 'brand_id',
        'purity_id', 'huid', 'gwt', 'nwt', 'design', 'pcs', 'hallmark','hallmark_charge','wastage_charge','other_charge','making_in_rs','making_in_percent',
        'supplier_id', 'bill_number', 'image', 'basic_rate',
        'purchase_rates', 'mrp', 'sale_rate', 'gm', 'diamond_value',
        'diamond_details', 'stone_details', 'stone_value', 'created_by','Wastage_charge'
    ];
    public function barcodes()
    {
     return $this->belongsTo(ProductService::class,'item_id');
    }
}
