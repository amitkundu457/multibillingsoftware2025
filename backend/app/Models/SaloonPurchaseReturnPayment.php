<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
class SaloonPurchaseReturnPayment extends Model
{
    //
    use HasFactory;

    protected $fillable = [
        'amount',
        'payment_type',
        'sales_return_id',
        'payment_note',
        'purchase_return_id',
    ];

    public function SaloonpurchaseReturn(){
        return $this->belongsTo(SaloonPurchaseReturn::class,'purchase_return_id');
    }
}
