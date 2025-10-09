<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserInfo extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'mobile_number',
        'email',
        'first_name',
        'last_name',
        'category',
        'business_name',
        'address_1',
        'address_2',
        'landmark',
        'pincode',
        'country',
        'state',
        'city',
        'agreed_to_terms',
        'gst'
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'agreed_to_terms' => 'boolean',
    ];
}
