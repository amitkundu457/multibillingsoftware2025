<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Account extends Model
{
    protected $fillable = [
        'rcp_no',
        'credit_customer_id',
        'debit_customer_id',
        'recive_id',
        'amount',
        'ref_no',
        'narration',
        'created_by',
        'checkin_date',
        'account_type',
    ];

    public function creditCustomer()
    {
        return $this->belongsTo(AccountMaster::class, 'credit_customer_id');
    }


    // Relationship for Debit Customer
    public function debitCustomer()
    {
        return $this->belongsTo(AccountMaster::class, 'debit_customer_id');
    }
}
