<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Distrubutrer extends Model
{
    protected $fillable = [
        'user_id',
        'company_name',
        'company_logo',
        'address',
        'phone',
        'website',
        'email',
        'pan_number',
        'gst_number',
        'ifsc_code',
        'bank_name',
        'account_number',
        'account_holder_name',
        'account_type',
        'status',
        'created_by',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'dist_id', 'id'); // distributors.dist_id connects to users.id
    }
    public function userInformation(){
        return $this->belongsTo(UserInformation::class,'dist_id');
    }

    public function userdist()
    {
        return $this->belongsTo(User::class,'user_id' ); // distributors.dist_id connects to users.id
    }
    
}
