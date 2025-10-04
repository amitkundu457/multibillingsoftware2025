<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class selectedProduct extends Model
{
    //
    use HasFactory;

    protected $fillable=[
        'created_by',
        'productName',
        'productPrice',
        'quantity',
    ];

}
