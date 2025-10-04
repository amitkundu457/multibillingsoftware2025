<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SoftwareCommission extends Model
{
    protected $fillable = [
        'user_id',
        'user_information_id',
        'commission',
        'total_amount',
        'software_type',
    ];

    public function client(){
        return $this->belongsTo(UserInformation::class,'user_information_id','id');
    }
}
