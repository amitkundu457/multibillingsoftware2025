<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class KotOrder extends Model
{
    //
      protected $fillable = ['table_no'];

    public function items()
    {
        return $this->hasMany(KotOrderItem::class);
    }

    public function kot()
    {
        return $this->hasOne(Kot::class);
    }



}
