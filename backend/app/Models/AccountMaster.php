<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AccountMaster extends Model
{
    protected $fillable = [
        'account_name',
        'gstin',
        'phone',
        'account_group_id',
        'city',
        'state',
        'contact_person',
        'blance', // should this be "balance"?
        'status',
        'created_by'
    ];
    // public function accounts(){
    //     return $this->hasMany(Account::class,'customer_id');
    // }
    public function accounts()
{
    return $this->hasMany(Account::class, 'credit_customer_id'); // or use both if needed
}
}
