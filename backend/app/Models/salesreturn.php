<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\PurchaseReturnPayment;
use App\Models\salesreturnPayment; // Ensure this model exists and is correctly namespaced
class salesreturn extends Model
{
    //
    use HasFactory;

    protected $table = 'salesreturns'; // Explicitly defining table name

    protected $fillable = [
        'customer_name',
        'date',
        'status',
        'reference_no',
        'reason',
        'product_service_id',
        'quantity',
        'created_by'
    ];

    // Define relationship with purchase return payments (one to many)
    public function saleReturnPayments()
    {
        return $this->hasMany(salesreturnPayment::class, 'sales_return_id');
    }
    public function product(){
        return $this->belongsTo(ProductService::class,"product_service_id");
    }
}
