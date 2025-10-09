<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    //
    protected $fillable = [
        'title',
        'image',
        'description',
        'amount',
    ];

    public function infousers(){
        return $this->hasMany(UserInformation::class,'product_id');
    }
}
