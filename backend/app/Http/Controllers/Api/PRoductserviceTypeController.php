<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Type;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;


class PRoductserviceTypeController extends Controller
{
    public function index()
    {
        $customer = JWTAuth::parseToken()->authenticate();
       

        // Fetch only the groups belonging to the authenticated user
        $groups = Type::where('user_id', $customer->id)->get();

        return response()->json($groups);
    }


    // Store a new product service group (returns JSON)
    public function store(Request $request)
    {
        $customer = JWTAuth::parseToken()->authenticate();

        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        // Ensure user_id is added to the request data
        $group = Type::create([
            'name' => $request->name,
            'user_id' => $customer->id, // Assign authenticated user ID
        ]);

        return response()->json([
            'message' => 'Product Service Group created successfully.',
            'data' => $group
        ]);
    }


    // Show the form to edit a product service group (returns JSON)
    public function show(Type $type)
    {
        return response()->json($type);
    }

    // Update a product service group (returns JSON)
    public function update(Request $request, Type $type)
    {
        $customer = JWTAuth::parseToken()->authenticate();

        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        // Ensure that the user_id is set from the token
        $data = $request->only('name'); // Only allow 'name' to be updated
        $data['user_id'] = $customer->id; // Assign user_id from authenticated user

        $type->update($data);

        return response()->json([
            'message' => 'Product Service Group updated successfully.',
            'data' => $type
        ]);
    }


    // Delete a product service group (returns JSON)
    public function destroy(Type $type)
    {
        $type->delete();

        return response()->json(['message' => 'Product Service Group deleted successfully.']);
    }
}
