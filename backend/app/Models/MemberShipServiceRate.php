<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MemberShipServiceRate extends Model
{
    protected $fillable=[
        'group_id',
        'service_type_id',
        'membership_plan_id',
    ];
}
