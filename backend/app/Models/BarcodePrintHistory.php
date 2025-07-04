<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BarcodePrintHistory extends Model
{
   
    protected $fillable = [
        'barcode_id',
        'product_id',
        'printed_by',
        'printed_at',
    ];

    public function product()
    {
        return $this->belongsTo(ProductService::class);
    }

    public function barcode()
    {
        return $this->belongsTo(Barcode::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'printed_by');
    }
}
