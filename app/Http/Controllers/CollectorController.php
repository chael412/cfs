<?php

namespace App\Http\Controllers;

use App\Models\Collector;
use App\Http\Requests\StoreCollectorRequest;
use App\Http\Requests\UpdateCollectorRequest;
use App\Http\Resources\CollectorResource;
use Inertia\Inertia;

class CollectorController extends Controller
{
    // API function
    public function indexApi()
    {
        try {
            $search = request('lastname');
            $sortColumn = request('sortColumn', 'lastname');
            $sortDirection = request('sortDirection', 'asc');

            $validSortColumns = [
                'lastname',
            ];

            if (!in_array($sortColumn, $validSortColumns)) {
                $sortColumn = 'lastname';
            }

            $query = Collector::query()
                ->when($search, function ($query) use ($search) {
                    return $query->where('lastname', 'like', $search . '%');
                });

            $authors = $query->orderBy($sortColumn, $sortDirection)
                ->paginate(50);

            return response()->json($authors, 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error: ' . $e->getMessage()], 404);
        }
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Collector/Index', );
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Collector/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCollectorRequest $request)
    {
        try {
            $data = $request->validated();
            Collector::create($data);

            return to_route('collectors.index');

        }  catch (\Exception $e) {
            return response()->json(['message' => 'Error: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Collector $collector)
    {
        return inertia('Collector/Show', [
            'collector' => new CollectorResource($collector),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Collector $collector)
    {
        return inertia('Collector/Edit', [
            'collector' => new CollectorResource($collector),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCollectorRequest $request, Collector $collector)
    {
        try {
            $data = $request->validated();

            $collector->update($data);

            return redirect()->route('collectors.index');
        } catch (\Exception $e) {
            return back()->withErrors(['message' => 'Error updating material: ' . $e->getMessage()])->withInput();
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Collector $collector)
    {
        try {
            $collector->delete();
            return response()->json([
                'message' => 'Collector deleted successfully.'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error deleting collector: ' . $e->getMessage()
            ], 500);
        }
    }
}
