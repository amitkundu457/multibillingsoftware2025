<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrderPackageServiceDetail extends Model
{
    //
    protected $fillable = ['order_package_id','service_id','service_name','price','quantity',  'additional_charge','stylist_name','subtotal'];


    public function order()
    {
        return $this->belongsTo(OrderPackageService::class, 'order_package_id');
    }

}
