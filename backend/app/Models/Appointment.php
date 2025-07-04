<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Appointment extends Model
{
    use HasFactory;


    // The attributes that are mass assignable
    protected $fillable = [
        'appointment_date', // Date of appointment
        'appointment_time', // Time of appointment
        'name',             // Client's name
        'phone',            // Client's phone number
        'service',          // Type of service for the appointment
        'gender',  
        'created_by',
        'stylist'
                 // Gender of the client (Male, Female, Other)
    ];



     protected $dates = [
        'appointment_date', // Automatically cast 'appointment_date' to a Carbon instance
    ];


}
