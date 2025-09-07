<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SoaController extends Controller
{
    public function searchSoa(Request $request)
    {
        $search = $request->query('search'); // only ID

        if (!is_numeric($search)) {
            return response()->json([
                'message' => "Search must be a numeric customer ID."
            ], 400);
        }

        $customer = Customer::with([
            'customerPlans.plan',
            'customerPlans.collector',
            'customerPlans.transactions' => function ($query) {
                $query->orderBy('date_billing', 'asc');
            }
        ])->where('id', $search)->first();

        if (!$customer) {
            return response()->json([
                'message' => "No customer found with ID: {$search}"
            ], 404);
        }

        return response()->json([
            'customer' => $customer,
        ]);
    }



    public function getSoa($customerId)
    {
        // Get the customer with their plans, collectors, and transactions
        $customer = Customer::with([
            'customerPlans.plan',
            'customerPlans.collector',
            'customerPlans.transactions' => function ($query) {
                $query->orderBy('date_billing', 'asc');
            }
        ])->findOrFail($customerId);

        return response()->json([
            'customer' => $customer,
        ]);
    }

    public function index()
    {
        return Inertia::render('Soa/Index');
    }
}
