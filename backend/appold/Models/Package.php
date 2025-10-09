<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Package extends Model
{
    protected $fillable=[
        'name',
        'type_id',
        'subtype_id',
        'price',
        'tax_id',
        'tax_type_id',
        'hsn',
        'group_id',
        'category_id',
        'service_type_id',
        'created_by',
        'nos',
        'pa_name_id'
    ];
}
