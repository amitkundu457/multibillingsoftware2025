<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Stylist;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Log;


class StylistController extends Controller
{
    //

    // Show a list of all stylists
    public function index()
    {
        $customer = JWTAuth::parseToken()->authenticate();
    Log::info('Authenticated Customer:', ['customer' => $customer]);

        $stylists = Stylist::all();
        return response()->json($stylists);
    }

    // Show the form for creating a new stylist
    public function create()
    {
        // Not needed for API
    }

    // Store a newly created stylist
    public function store(Request $request)
    {
        $customer = JWTAuth::parseToken()->authenticate();
    Log::info('Authenticated Customer:', ['customer' => $customer]);

        $request->validate([
            'name' => 'required|string|max:255',
            'expertise' => 'required|string|max:255',
            'isAvailable' => 'boolean',
        ]);

        $stylist = Stylist::create($request->all());
        return response()->json($stylist, 201);
    }

    // Display a specific stylist
    public function show($id)
    {
        $stylist = Stylist::findOrFail($id);
        return response()->json($stylist);
    }

    // Show the form for editing a stylist (optional for API)
    public function edit($id)
    {
        // Not needed for API
    }

    // Update a specific stylist
    public function update(Request $request, $id)
    {
        $stylist = Stylist::findOrFail($id);
        $stylist->update($request->all());
        return response()->json($stylist);
    }

    // Delete a stylist
    public function destroy($id)
    {
        $stylist = Stylist::findOrFail($id);
        $stylist->delete();
        return response()->json(['message' => 'Stylist deleted successfully']);
    }

}
