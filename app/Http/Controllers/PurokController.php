<?php

namespace App\Http\Controllers;

use App\Models\Purok;
use App\Http\Requests\StorePurokRequest;
use App\Http\Requests\UpdatePurokRequest;

class PurokController extends Controller
{
    public function purokOptions()
    {
        $puroks = Purok::with('barangay')->get();

        return response()->json($puroks);
    }

    /*

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePurokRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Purok $purok)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Purok $purok)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePurokRequest $request, Purok $purok)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Purok $purok)
    {
        //
    }
}
