<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
class PackageItem extends Model
{
    //
    use HasFactory;

    protected $fillable = ['package_id','todayuse','used', 'service_name', 'total_quantity','type'];
    public function package()
    {
        return $this->belongsTo(PackageName::class);
    }
}
