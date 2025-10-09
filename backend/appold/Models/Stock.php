<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Stock extends Model
{
    protected $fillable = [
        'product_service_id',
        'product_service_name',
        'quantity',
        'gross_weight',
        'net_weight',
        'rate',
        'mrp',
        'date',
          'created_by'
    ];

    public function product_service(){
        return $this->belongsTo(ProductService::class);
    }
}
