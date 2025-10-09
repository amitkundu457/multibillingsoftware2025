<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;


class CustomerLastOrder extends Model
{
    //
        use HasFactory;

    protected $fillable =['customer_id','created_by','last_order_date','vendor_type'];
}
