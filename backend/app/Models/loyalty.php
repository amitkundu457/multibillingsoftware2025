<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class loyalty extends Model
{
    //
    protected $fillable = [
    'loyalty_balance',
    'min_loyalty_required',
    'min_invoice_bill_to_get_point',
    'max_loyalty_redeemable',
    'expiry',
    'set_loyalty_points'
    ];
}
