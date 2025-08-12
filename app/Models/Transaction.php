<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    protected $fillable = [
        'customer_plan_id',
        'bill_no',
        'rebate',
        'partial',
        'bill_amount',
        'remarks',
        'status'
    ];

    public function customerPlan()
    {
        return $this->belongsTo(CustomerPlan::class);
    }
}
