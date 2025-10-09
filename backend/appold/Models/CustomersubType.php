<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\App;

class CustomersubType extends Model
{
    protected $fillable=[
'type_id','name','created_by'
    ];

    public function customerType()
    {
        return $this->belongsTo(CustomerType::class, 'type_id'); // 'type_id' is the foreign key
    }
}
