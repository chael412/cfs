<?php

namespace Database\Seeders;

use App\Models\Collector;
use App\Models\Customer;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        Collector::factory()->count(10)->create();
        Customer::factory(50)->create();


    }
}
