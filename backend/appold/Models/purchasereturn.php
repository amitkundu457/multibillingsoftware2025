<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PurchaseReturn extends Model
{
    use HasFactory;

    protected $table = 'purchasereturns'; // Explicitly defining table name

    protected $fillable = [
        'supplier_name',
        'date',
        'status',
        'reference_no',
        'reasons',
        'created_by'
    ];

    // Define relationship with purchase return payments (one to many)
    public function purchaseReturnPayments()
    {
        return $this->hasMany(PurchaseReturnPayment::class, 'stock_return_id');
    }
}
