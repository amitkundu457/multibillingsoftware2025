<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CustomerType extends Model
{
    protected $fillable=[
        'type_id','name','created_by'
            ];

            public function customerSubTypes()
    {
        return $this->belongsTo(CustomersubType::class, 'type_id');
    }
}
