<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class salesreturnPayment extends Model
{
    //
    protected $fillable = [
        'amount', 'payment_type','sales_return_id', 'payment_note', 'purchase_return_id'
    ];


    public function purchaseReturn()
    {
        return $this->belongsTo(salesreturn::class, 'sales_return_id');
    }
}
