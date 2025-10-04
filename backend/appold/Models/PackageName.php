<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PackageName extends Model
{
    use HasFactory;

    protected $fillable=['name','totalPackageAmount','created_by','expires_after_months','price'];

    public function items()
{
    return $this->hasMany(PackageItem::class);
}
}
