<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ReminderSlot extends Model
{
    protected $fillable = [
        'name',
        'days',
        'target',
        'send_time',
        'enabled',
    ];

    // cast 'days' as array automatically
    protected $casts = [
        'days' => 'array',
        'enabled' => 'boolean',
    ];
}
