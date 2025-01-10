<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CustomerPlan extends Model
{
    /** @use HasFactory<\Database\Factories\CustomerPlanFactory> */
    use HasFactory;

    protected $fillable = [
        'customer_id',
        'plan_id'
    ];



    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function plan()
    {
        return $this->belongsTo(Plan::class);
    }
}
