<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SalesAssign;
use Illuminate\Http\Request;

class SalesAssignController extends Controller
{

    public function index()
    {
        return SalesAssign::all();
    }
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'product_id' => 'required|exists:products,id',
            'amount' => 'required|numeric|min:0',
            'country' => 'required|string',
            'state' => 'required|string',
            'city' => 'required|string',
        ]);

        $salesAssign = SalesAssign::create($validated);

        return response()->json([
            'message' => 'Sales assignment created successfully',
            'data' => $salesAssign,
        ], 201);
    }

    public function edit($id)
    {
        $salesAssign = SalesAssign::find($id);

        if (!$salesAssign) {
            return response()->json(['message' => 'Sales assignment not found'], 404);
        }

        return response()->json([
            'message' => 'Sales assignment retrieved successfully',
            'data' => $salesAssign,
        ]);
    }

    public function update(Request $request, $id)
    {
        $salesAssign = SalesAssign::find($id);

        if (!$salesAssign) {
            return response()->json(['message' => 'Sales assignment not found'], 404);
        }

        $validated = $request->validate([
            'user_id' => 'sometimes|exists:users,id',
            'product_id' => 'sometimes|exists:products,id',
            'amount' => 'sometimes|numeric|min:0',
            'country' => 'sometimes|string',
            'state' => 'sometimes|string',
            'city' => 'sometimes|string',
        ]);

        $salesAssign->update($validated);

        return response()->json([
            'message' => 'Sales assignment updated successfully',
            'data' => $salesAssign,
        ]);
    }

    public function destroy($id)
    {
        $salesAssign = SalesAssign::find($id);

        if (!$salesAssign) {
            return response()->json(['message' => 'Sales assignment not found'], 404);
        }

        $salesAssign->delete();

        return response()->json(['message' => 'Sales assignment deleted successfully']);
    }
}
