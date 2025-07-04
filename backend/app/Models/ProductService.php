<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductService extends Model
{
    protected $fillable = [
        'name',
        'type',
        'code',
        'company_id',
        'group_id',
        'gram',
        'mrp',
        'tax_rate',
        'hsn',
        'rate_id',
        'image',
        'created_by',
        'rate',
        'brand',
        'description',
        'pro_ser_type',
        'expires',
        'created_by',
        'current_stock'
    ];

    public function barcodes()
    {
     return $this->hasOne(Barcode::class,'item_id');
    }
    public function ratemasters() {
        return $this->hasOne(RateMasters::class, 'id', 'rate_type');
    }

    //new im  created for stock transactions
    public function stockTransactions()
    {
        return $this->hasMany(StockTransaction::class);
    }
    public function salesReturn(){
        return $this->hasMany(salesreturn::class, 'product_service_id');
    }

}
