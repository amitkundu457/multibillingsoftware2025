<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StockTransaction extends Model
{
    protected $fillable = ['product_service_id', 'created_by','quantity', 'type', 'source', 'remarks'];

    // public function product()
    // {
    //     return $this->belongsTo(ProductService::class);
    // }
    public function product()
{
    return $this->belongsTo(ProductService::class, 'product_service_id');
}
}
