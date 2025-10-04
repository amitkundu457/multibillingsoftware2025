<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PurchaseItem extends Model
{
    protected $fillable = [
        'purchase_id',
        'product_name',
        'pcs',
        'gwt',
        'nwt',
        'rate',
        'other_chg',
        'disc',
        'disc_percent',
        'gst',
        'taxable',
        'total_gst',
        'net_amount',
        'product_service_id',
    ];
}
