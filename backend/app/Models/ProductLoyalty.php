<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory; // Add this import

use App\Models\ProductLoyalty;


class ProductLoyalty extends Model
{
    //
    use HasFactory;

    // Define the table associated with the model (if different from the plural form)
    protected $table = 'productloyalties';

    // Fields that can be mass-assigned
    protected $fillable = [
        'product_service_id',
        'loyalty_id',

    ];

    public function productService()
    {
        return $this->belongsTo(ProductService::class, 'product_service_id');
    }

    public function loyalty()
    {
        return $this->belongsTo(Loyalty::class, 'loyalty_id');
    }
}
