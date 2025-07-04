<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PackageServiceName extends Model
{
    //
    protected $fillable = ['package_id', 'service_name', 'price','quantity'];




    public function package()
{
    return $this->belongsTo(PackageAssign::class, 'package_id', 'package_id');
}


}
