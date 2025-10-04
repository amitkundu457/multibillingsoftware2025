<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MembershipServiceGroup extends Model
{
    protected $fillable=[
        'created_by',
        'name',
        'type_id',
    ];
}
