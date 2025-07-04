<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Enquiry extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'description','source', 'date','phone', 'email','status', 'follow_up_date', 'follow_up_notes'];

    public function reminders()
    {
        return $this->hasMany(Reminder::class);
    }

    public function followUps()
    {
        return $this->hasMany(FollowUp::class);
    }
}
