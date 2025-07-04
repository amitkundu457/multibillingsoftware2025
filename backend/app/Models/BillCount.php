<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BillCount extends Model
{
    //
    protected $fillable = ['created_by', 'bill_count'];

    public function user()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
