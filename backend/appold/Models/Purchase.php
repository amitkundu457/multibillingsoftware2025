<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Purchase extends Model
{
    protected $fillable = [
        'voucher_no',
        'date',
        'bill_no',
        'is_igst',
        'user_id',
        'payment_mode',
        'credit_days',
        'created_by',
    ];

    public function purchase_items()
    {
        return $this->hasMany(PurchaseItem::class);
    }

    public function user(){
        return $this->belongsTo(User::class);
    }
    public function supplier(){
        return $this->belongsTo(Supplier::class, 'user_id');
    }
}
