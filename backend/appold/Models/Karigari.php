<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Karigari extends Model
{
    protected $fillable = [
        'voucher_no',
        'date',
        // 'user_id',
        'type',
        'created_by'
         
    ];

    public function karigari_items(){
        return $this->hasMany(KarigariItem::class);
    }
}
