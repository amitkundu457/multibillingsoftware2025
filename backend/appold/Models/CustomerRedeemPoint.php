<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;


class CustomerRedeemPoint extends Model
{
    //

    //
    use HasFactory;

    protected $fillable = ['customer_id', 'redeem_points'];

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }
}
