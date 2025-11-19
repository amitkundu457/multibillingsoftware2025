<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\KarigariItem;
class KarigarList extends Model
{
    //
    protected $fillable = [
        'name',
        'created_By',
       
    ];

    public function karigar_items()
    {
        return $this->hasMany(KarigariItem::class, 'karigari_id');
    }
    public function karigar(){
        return $this->hasMany(KarigariItem::class, '	karigarlist_id');
        
    }
}
