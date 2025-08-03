<?php

namespace Database\Seeders;

use App\Models\Plan;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PlanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $plans = [
            ['mbps' => '30 mbps',  'plan_price' => '₱600.00'],
            ['mbps' => '50 mbps',  'plan_price' => '₱800.00'],
            ['mbps' => '100 mbps', 'plan_price' => '₱1,000.00'],
            ['mbps' => '150 mbps', 'plan_price' => '₱1,200.00'],
            ['mbps' => '200 mbps', 'plan_price' => '₱1,500.00'],
            ['mbps' => '300 mbps', 'plan_price' => '₱2,000.00'],
            ['mbps' => '400 mbps', 'plan_price' => '₱2,500.00'],
        ];

        foreach ($plans as $plan) {
            Plan::create($plan);
        }
    }
}
