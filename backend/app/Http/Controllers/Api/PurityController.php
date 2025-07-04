<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\purity;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Log;


class PurityController extends Controller
{
    //

    // public function index()
    // {
    //     $customer = JWTAuth::parseToken()->authenticate();
    // Log::info('Authenticated Customer:', ['customer' => $customer]);
    //     $data = purity::all();
    //     return response()->json($data, 200);
    // }
    public function index()
{
    $customer = JWTAuth::parseToken()->authenticate();
    Log::info('Authenticated Customer:', ['customer' => $customer]);

    // Filter data by created_by
    $data = Purity::where('created_by', $customer->id)->get();

    return response()->json($data, 200);
}


    //  public function store(Request $request)
    // {
    //     $request->validate([
    //         'name' => 'required|string|max:255', // Adjust validation as needed
    //     ]);

    //     $purity = purity::create([
    //         'name' => $request->name,
    //     ]);

    //     return response()->json(['message' => 'Purity created successfully', 'data' => $purity], 201);
    // }

    public function store(Request $request)
{
    $customer = JWTAuth::parseToken()->authenticate();
    Log::info('Authenticated Customer:', ['customer' => $customer]);

    $request->validate([
        'name' => 'required|string|max:255',
    ]);

    $purity = Purity::create([
        'name' => $request->name,
        'created_by' => $customer->id,
    ]);

    return response()->json([
        'message' => 'Purity created successfully',
        'data' => $purity,
    ], 201);
}

    // ✅ Update an existing record
    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $purity = purity::find($id);
        if (!$purity) {
            return response()->json(['message' => 'Purity not found'], 404);
        }

        $purity->update([
            'name' => $request->name,
        ]);

        return response()->json(['message' => 'Purity updated successfully', 'data' => $purity], 200);
    }

    // ✅ Delete a record
    public function destroy($id)
    {
        $purity = Purity::find($id);
        if (!$purity) {
            return response()->json(['message' => 'Purity not found'], 404);
        }

        $purity->delete();
        return response()->json(['message' => 'Purity deleted successfully'], 200);
    }
}
