<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PackageAssign extends Model
{
    protected $fillable = [
       'customer_id', 'package_no', 'receipt_no', 'package_name', 'package_amount',
        'service_amount', 'paid_amount', 'balance_amount', 'remaining_amount',
        'receipt_amount', 'payment_date', 'package_booking', 'package_expiry',
        'settlement_mode', 'payment_status', 'package_status','package_id','created_by'
    ];

    public function services()
{
    return $this->hasMany(PackageServiceName::class, 'package_id', 'package_id');
}

public function customer()
{
    return $this->belongsTo(Customer::class,'customer_id','user_id');
}
public function users()
{
    return $this->belongsTo(User::class, 'customer_id');
}
public function package()
{
    return $this->belongsTo(Package::class, 'package_id');
}

}
