<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class CollectionController extends Controller
{
    public function index()
    {
        return Inertia::render('Collection/Index');
    }

    public function show()
    {
        return Inertia::render('Collection/Show');
    }
}
