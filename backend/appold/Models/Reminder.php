<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;

use Illuminate\Database\Eloquent\Model;

class Reminder extends Model
{
    //


        use HasFactory;

        protected $fillable = ['enquiry_id', 'reminder_date', 'note'];

        public function enquiry()
        {
            return $this->belongsTo(Enquiry::class);
        }

}
