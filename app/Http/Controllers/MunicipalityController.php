<?php

namespace App\Http\Controllers;

use App\Models\Municipality;
use App\Http\Requests\StoreMunicipalityRequest;
use App\Http\Requests\UpdateMunicipalityRequest;

class MunicipalityController extends Controller
{

    public function barangaysByMunicipality($municipalityId)
    {
        try {
            $municipality = Municipality::with('barangays')->findOrFail($municipalityId);

            return response()->json($municipality->barangays, 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error fetching barangays: ' . $e->getMessage()
            ], 500);
        }
    }

    public function municipalitiesWithBarangays()
    {
        try {
            $municipalities = Municipality::with('barangays')->get();

            return response()->json($municipalities, 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error fetching municipalities: ' . $e->getMessage()
            ], 500);
        }
    }


    public function municipalityOptions()
    {
        $municipalities = Municipality::all();

        return response()->json($municipalities);
    }

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
    public function store(StoreMunicipalityRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Municipality $municipality)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Municipality $municipality)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateMunicipalityRequest $request, Municipality $municipality)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Municipality $municipality)
    {
        //
    }
}
