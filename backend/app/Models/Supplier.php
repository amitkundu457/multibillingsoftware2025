<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Supplier extends Model
{
    //
    protected $fillable = [
        'name',
        'phone_number',
        'address',
        'state',
        'city',
        'pincode',
        'created_by'
    ];

    public function pruchase(){
        return $this->hasMany(Purchase::class, 'user_id');
    }
}
