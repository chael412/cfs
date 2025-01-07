<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Collector extends Model
{
    /** @use HasFactory<\Database\Factories\CollectorFactory> */
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'firstname',
        'middlename',
        'lastname',
        'sex',
        'marital_status',
        'birthdate',
        'address',
        'cellphone_no',
    ];
}
