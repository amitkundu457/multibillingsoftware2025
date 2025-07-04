<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;


class SmsCredential extends Model
{
    //

      use HasFactory;

    protected $fillable=[
        'business_name',
        'sms_username',
        'sms_password',
        'sms_sender',
        'sms_entity_id'
    ];

    public function smsSettings()
    {
        return $this->hasMany(SmsSetting::class);
    }
}
