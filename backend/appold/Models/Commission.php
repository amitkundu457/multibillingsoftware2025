<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Commission extends Model
{
    public function coinpurchases() {
        return $this->belongsTo(ConiPurchase::class);
    }
}
