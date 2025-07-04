<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tax extends Model
{
    protected $fillable=[
        'name',
        'amount',
        'fixed_amount',
        'created_by'
    ];
}
