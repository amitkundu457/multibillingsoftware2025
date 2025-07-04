<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class payment_stock extends Model
{
    use HasFactory;

    protected $fillable = [
        'amount',
        'payment_type',
        'payment_note',
    ];
}
