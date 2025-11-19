<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class KarigariItem extends Model
{
    protected $fillable = [
        'karigari_id',
        'product_name',
        'nwt',
        'pcs',
        'tounch',
        'rate',
        'karigarlist_id',

        
    ];

    public function karigar_list()
    {
        return $this->belongsTo(KarigarList::class, 'karigarlist_id');
    }
}
