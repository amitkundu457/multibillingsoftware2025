<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RedeemSetup extends Model
{
    //
    protected $fillable = [
        'points',
        'rupees',

    ];

    public function loyalty()
    {
        return $this->belongsTo(Loyalty::class, 'loyalty_id');
    }

}
