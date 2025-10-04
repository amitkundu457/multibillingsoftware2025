<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CoverImage extends Model
{
    //
    protected $fillable = [
        'cover',
        'created_by',
        'type'
    ];
}
