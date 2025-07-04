<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;


class OrderCoinSetting extends Model
{
    //
    use HasFactory;

    protected $table = 'order_coin_settings';

    protected $fillable = [
        'coins_per_order',
    ];
}
