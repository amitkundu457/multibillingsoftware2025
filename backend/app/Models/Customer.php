<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    protected $fillable = ['user_id', 'address', 'pincode', 'state', 'country','phone',
    'customer_type',
    'customer_sub_type',
    'dob',
    'anniversary',
    'gender',
    'visit_source',
    'created_by',
    'customerEnquiry',
    'remarke',
    'visit_count',
    'gstNo'

    ];

    public function userc()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
    public function coinpurchases() {
        return $this->hasMany(ConiPurchase::class);
    }

    public function orders()
{
    return $this->hasMany(Order::class, 'customer_id');
}
}
