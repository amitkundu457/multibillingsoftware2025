<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrderPackageService extends Model
{
    //
    protected $fillable = ['bill_no','package_number','customer_id',  'price'];

    public function serviceDetails()
    {
        return $this->hasMany(OrderPackageServiceDetail::class, 'order_package_id');
    }
    public function users()
    {
        return $this->belongsTo(User::class, 'customer_id');
    }

    public function package()
    {
        return $this->belongsTo(PackageAssign::class,'package_number','package_no');
    }

}
