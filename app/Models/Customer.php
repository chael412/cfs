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
        'cellphone_no',
        'spouse_name',
        'spouse_occupation',
        'spouse_cellphone_no',
        'status'
    ];

    public function customerPlans()
    {
        return $this->hasMany(CustomerPlan::class);
    }
}
