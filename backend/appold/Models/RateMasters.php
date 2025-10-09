<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RateMasters extends Model
{
    //
    protected $fillable = [
        'labelhere',
        'rate',
       // 'purity',
        //'makingpergm',
        //'makingprpercent',
       // 'makingdiscpercent',
       // 'makingdiscprice',
       'created_by'
    ];
    public function productservice() {
        return $this->belongsTo(ProductService::class, 'rate_type', 'id');
    }

}
