<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class QrImage extends Model
{
    //
    use HasFactory;

    protected $fillable = [
        'cover',
        'created_by',
        'type'
    ];
    public function user()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
