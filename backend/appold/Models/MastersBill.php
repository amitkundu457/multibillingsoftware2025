<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MastersBill extends Model
{
    use HasFactory;

    protected $table = 'masters_bills'; // Ensure the correct table name

    protected $fillable = ['logo','created_by']; // Ensure 'logo' is mass assignable
}
