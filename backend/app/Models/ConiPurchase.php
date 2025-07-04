<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ConiPurchase extends Model
{
    protected $fillable=[
'coins','amount','created_by','payment_method'
    ];


    public function purchases(){
        return $this->hasMany(User::class,'created_by');
    }

    public function commission() {
        return $this->hasOne(Commission::class);
    }
}
