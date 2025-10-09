<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class AdvanceMessageDate extends Model
{
    //
    use HasFactory;
    protected $fillable = ['birthdayAdvance','anniversaryAdvance','bblcAdvanceDate','reminderAdvanceDate','created_by'];
}
