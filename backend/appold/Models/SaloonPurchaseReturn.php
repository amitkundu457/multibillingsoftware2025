<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SaloonPurchaseReturn extends Model
{
    use HasFactory;

    protected $table = 'saloon_purchase_returns'; // If table name doesn't follow Laravel convention

    protected $fillable = [
        'customer_name',
        'date',
        'reference_no',
        'reason',
        'status',
        'created_by',
        'quantity',
        'product_service_id',
    ];

    /**
     * Relationships
     */

     public function saloonPurchaseReturnPayments()
     {
         return $this->hasOne(SaloonPurchaseReturnPayment::class, 'purchase_return_id');
     }

    public function product()
    {
        return $this->belongsTo(ProductService::class, 'product_service_id');
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
