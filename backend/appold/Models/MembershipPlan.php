<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MembershipPlan extends Model
{
    protected $fillable = ['name', 'code', 'fees', 'validity', 'discount', 'remark','created_by','type_id'];
}
