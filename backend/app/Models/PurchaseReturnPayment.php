<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\PurchaseReturn; // ✅ Important

class PurchaseReturnPayment extends Model
{
    use HasFactory;

    protected $fillable = [
        'amount',
        'payment_type',
        'payment_note',
        'purchase_return_id',
    ];

    public function purchaseReturn()
    {
        return $this->belongsTo(PurchaseReturn::class, 'purchase_return_id');
    }
}