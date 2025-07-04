<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ParcelOrder extends Model
{
    //
    protected $fillable = ['customer_id', 'status','token','created_by'];

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }
      public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function items()
    {
        return $this->hasMany(ParcelOrderItem::class);
    }

    public function bill()
    {
        return $this->hasOne(ParcelBill::class);
    }

    protected static function boot()
{
    parent::boot();

    static::creating(function ($model) {
        $lastToken = self::max('token') ?? 0;
        $model->token = $lastToken + 1;
    });
}

public function createdBy()
{
    return $this->belongsTo(User::class, 'created_by');
}


}
