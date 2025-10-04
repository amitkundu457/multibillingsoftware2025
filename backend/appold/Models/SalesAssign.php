<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SalesAssign extends Model
{
    protected $fillable = [
        'user_id',
        'product_id',
        'amount',
        'country',
        'state',
        'city',
    ];
}
