<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RedeemSetup extends Model
{
    //
    protected $fillable = [
        'redeem_points',
        'redeem_point_value_ofEach_point',
        'max_redeem',
        'min_invcValue_needed_toStartRedemp',
        'loyalty_id	',
    ];

    public function loyalty()
    {
        return $this->belongsTo(Loyalty::class, 'loyalty_id');
    }

}
