<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;

use Illuminate\Database\Eloquent\Model;

class FollowUp extends Model
{
    //
    use HasFactory;

    protected $fillable = ['enquiry_id', 'follow_up_date', 'notes'];

    public function enquiry()
    {
        return $this->belongsTo(Enquiry::class);
    }
}
