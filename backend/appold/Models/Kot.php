<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Kot extends Model
{
      protected $fillable = ['kot_order_id'];

    public function kotOrder()
    {
        return $this->belongsTo(KotOrder::class);
    }
}
