<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ProductServiceGroup;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Log;

class ProductServiceGroupController extends Controller
{
    // public function index()
    // {
    //     $customer = JWTAuth::parseToken()->authenticate();
    // Log::info('Authenticated Customer:', ['customer' => $customer]);

    //     $groups = ProductServiceGroup::all();
    //     return response()->json($groups);
    // }
    public function index()
{
    // Authenticate user using token
    $customer = JWTAuth::parseToken()->authenticate();
    Log::info('Authenticated Customer:', ['customer' => $customer]);

    // Fetch only the groups created by this customer
    $groups = ProductServiceGroup::where('created_by', $customer->id)->get();

    return response()->json($groups);
}


    // Store a new product service group (returns JSON)
    // public function store(Request $request)
    // {
    //     $request->validate([
    //         'name' => 'required|string|max:255',
    //     ]);

    //     $group = ProductServiceGroup::create($request->all());

    //     return response()->json(['message' => 'Product Service Group created successfully.', 'data' => $group]);
    // }
    public function store(Request $request)
{
    // Authenticate the customer via token
    $customer = JWTAuth::parseToken()->authenticate();

    // Validate incoming request
    $request->validate([
        'name' => 'required|string|max:255',
    ]);

    // Add 'created_by' to request data
    $data = $request->all();
    $data['created_by'] = $customer->id;

    // Create the new group
    $group = ProductServiceGroup::create($data);

    return response()->json([
        'message' => 'Product Service Group created successfully.',
        'data' => $group
    ]);
}


    // Show the form to edit a product service group (returns JSON)
    public function show(ProductServiceGroup $productServiceGroup)
    {
        return response()->json($productServiceGroup);
    }

    // Update a product service group (returns JSON)
    public function update(Request $request, ProductServiceGroup $productServiceGroup)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $productServiceGroup->update($request->all());

        return response()->json(['message' => 'Product Service Group updated successfully.', 'data' => $productServiceGroup]);
    }

    // Delete a product service group (returns JSON)
    public function destroy(ProductServiceGroup $productServiceGroup)
    {
        $productServiceGroup->delete();

        return response()->json(['message' => 'Product Service Group deleted successfully.']);
    }
}
