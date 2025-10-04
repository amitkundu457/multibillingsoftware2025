<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserInformation extends Model
{
    protected $fillable = [
        'mobile_number',
        'email',
        'first_name',
        'last_name',
        'category',
        'business_name',
        'address_1',
        'address_2',
        'landmark',
        'pincode',
        'country',
        'state',
        'city',
        'agreed_to_terms',
        'contant_person',
        'product_id',
        'user_id',
        'dist_id',
        'slug',
        'gst'
    ];
    public function prods(){
        return $this->belongsTo(Product::class,'product_id');
    }

    public function users(){
        return $this->belongsTo(User::class,'user_id');
    }
    public function distributor(){
        return $this->belongsTo(Distrubutrer::class,'dist_id','user_id');
    }
}
