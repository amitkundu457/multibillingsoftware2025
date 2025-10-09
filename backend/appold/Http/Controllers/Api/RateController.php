<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Rate;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Log;


class RateController extends Controller
{
    // public function index()
    // {
    //     $groups = Rate::all();
    //     return response()->json($groups);
    // }

    public function index()
{
    $customer = JWTAuth::parseToken()->authenticate();
    Log::info('Authenticated Customer:', ['customer' => $customer]);

    $groups = Rate::where('created_by', $customer->id)->get();

    return response()->json($groups);
}
    // Store a new product service group (returns JSON)
    // public function store(Request $request)
    // {
    //     $customer = JWTAuth::parseToken()->authenticate();
    // Log::info('Authenticated Customer:', ['customer' => $customer]);


    //     $request->validate([
    //         'name' => 'required|string|max:255',
    //     ]);

    //     $group = Rate::create($request->all());

    //     return response()->json(['message' => 'Product Service Group created successfully.', 'data' => $group]);
    // }
    public function store(Request $request)
{
    $customer = JWTAuth::parseToken()->authenticate();
    Log::info('Authenticated Customer:', ['customer' => $customer]);

    $validatedData = $request->validate([
        'name' => 'required|string|max:255',
    ]);

    $group = Rate::create([
        ...$validatedData,
        'created_by' => $customer->id,
    ]);

    return response()->json([
        'message' => 'Product Service Group created successfully.',
        'data' => $group
    ]);
}


    // Show the form to edit a product service group (returns JSON)
    public function show(Rate $rate)
    {
        return response()->json($rate);
    }

    // Update a product service group (returns JSON)
    public function update(Request $request, Rate $rate)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $rate->update($request->all());

        return response()->json(['message' => 'Product Service Group updated successfully.', 'data' => $rate]);
    }

    // Delete a product service group (returns JSON)
    public function destroy(Rate $rate)
    {
        $rate->delete();

        return response()->json(['message' => 'Product Service Group deleted successfully.']);
    }
}
