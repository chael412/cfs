<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Customer extends Model
{
    /** @use HasFactory<\Database\Factories\CustomerFactory> */
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'firstname',
        'middlename',
        'lastname',
        'sex',
        'marital_status',
        'birthdate',
        'address',
        'occupation',
        'contact_no',
        'status',
    ];

    public function customerPlans()
    {
        return $this->hasMany(CustomerPlan::class);
    }

    public function collector()
    {
        return $this->belongsTo(Collector::class);
    }
}
