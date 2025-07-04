<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;

use Illuminate\Http\Request;
use App\Models\SelectedProduct; // Ensure the correct model name
use JWTAuth; // Ensure this is imported at the top of your controller
class SelectedProductController extends Controller
{
    public function index()
    {
        $products = SelectedProduct::all();

        return response()->json([
            'message' => 'Products retrieved successfully!',
            'data' => $products,
        ], 200);
    }



public function store(Request $request)
{
    // Get the authenticated user (assumed to be using JWTAuth for authentication)
    $user = JWTAuth::parseToken()->authenticate();

    // Validate incoming data


     $data = $request->validate([
        'items' => 'required|array',
        'items.*.id' => 'required',
        'items.*.quantity' => 'required|integer|min:1',
        'items.*.productPrice' => 'required|numeric',
         'items.*.productName' => 'required|string|max:255',
    ]);

    // Loop through the products and create each one, adding the created_by field
    $products = [];
    foreach ($validated['products'] as $productData) {
        // Add 'created_by' to each product's data, referencing the authenticated user's ID
        $productData['created_by'] = $user->id;

        // Create the product
        $products[] = SelectedProduct::create($productData);
    }

    // Return the response
    return response()->json([
        'message' => 'Products added successfully!',
        'data' => $products,
    ], 201);
}





    public function destroy($id)
    {
        // Find the product by ID
        $product = SelectedProduct::find($id);

        // Check if the product exists
        if (!$product) {
            return response()->json([
                'message' => 'Product not found!',
            ], 404);
        }

        // Delete the product
        $product->delete();

        return response()->json([
            'message' => 'Product deleted successfully!',
        ], 200);
    }

    public function update(Request $request, $id)
    {
        // Find the product by ID
        $product = SelectedProduct::find($id);

        // Check if the product exists
        if (!$product) {
            return response()->json([
                'message' => 'Product not found!',
            ], 404);
        }

        // Validate the incoming request data
        $validated = $request->validate([
            'productName' => 'string|max:255',
            'productPrice' => 'numeric|min:0',
            'quantity' => 'integer|min:0',

        ]);

        // Update the product with the validated data
        $product->update($validated);

        return response()->json([
            'message' => 'Product updated successfully!',
            'data' => $product,
        ], 200);
    }


}
