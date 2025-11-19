<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SmsSetting extends Model
{
   protected $fillable=[
'sms_credential_id',
'description',
'created_by',
'template_id',
'status',
'description'
   ];

   public function smsCredential()
    {
        return $this->belongsTo(SmsCredential::class);
    }
}
