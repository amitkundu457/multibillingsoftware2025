<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class stockreturn extends Model
{
    use HasFactory;

    protected $table = 'stockreturn';

    protected $fillable = [
        'supplier_name',
        'date',
        'status',
        'reference_no',
    ];
}
