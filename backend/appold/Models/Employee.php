<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Employee extends Model
{
    protected $fillable = [
        'user_id',
        'phone',
        'address',
        'joining_date',
        'dob',
        'gender',
        'created_by'
        // 'department',
        // 'designation',
    ];

    public function users()
    {
        return $this->belongsTo(User::class, 'user_id','id');
    }
}
