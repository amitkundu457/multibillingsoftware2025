<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;  // <-- Add this line

use Illuminate\Database\Eloquent\Model;

class Stylist extends Model
{
    //
    use HasFactory;

    // Define which fields are mass assignable
    protected $fillable = [
        'name',
        'expertise',
        'isAvailable',
    ];
}
