<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MembershipSale extends Model
{
    protected $fillable = [
        'customer_id', 'plan_id','created_by', 'stylist_id', 'sale_date', 'amount', 'payment_method','member_number'
    ];

    public function customer()
    {
        return $this->belongsTo(User::class);
    }

    public function plan()
    {
        return $this->belongsTo(MembershipPlan::class);
    }

    public function stylist()
    {
        return $this->belongsTo(Stylist::class);
    }
}
