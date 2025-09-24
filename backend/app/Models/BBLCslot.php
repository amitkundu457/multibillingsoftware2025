<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BBLCslot extends Model
{
    protected $fillable = [
        'name',
        'days',
        'target',
        'send_time',
        'enabled'
    ];

    protected $casts = [
        'days' => 'array',
        'enabled' => 'boolean'
    ];
}
