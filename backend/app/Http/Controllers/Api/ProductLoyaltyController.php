<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ProductLoyalty;

class ProductLoyaltyController extends Controller
{
    //

    public function index()
    {


             $productLoyalties = ProductLoyalty::with(['ProductService', 'loyalty'])->get();

            // Return as JSON response
            return response()->json($productLoyalties);

    }


    public function store(Request $request)
    {
        // Validate the incoming data
        $data = $request->validate([
            'product_service_id' => 'required|exists:product_services,id', // Ensure the product_service_id exists in product_services
            'loyalty_id' => 'required|integer|min:1', // Ensure loyalty_amount is an integer and greater than 0
        ]);

        // Create a new product loyalty record
        $productLoyalty = productloyalty::create($data);

        // Return a successful response with the created product loyalty record
        return response()->json(['message' => 'Loyalty assigned successfully', 'data' => $productLoyalty], 201);
    }



    public function show($productId)
    {
        // Fetch product with its associated loyalty data
        $product = ProductService::with('productLoyalties')->findOrFail($productId);

        // Return the product data with loyalty details
        return response()->json($product);
    }

    public function update(Request $request, $id)
    {
        // Validate the incoming data
        $data = $request->validate([
            'loyalty_amount' => 'required|integer|min:1', // Ensure loyalty_amount is an integer and greater than 0
        ]);

        // Find the product loyalty by id
        $productLoyalty = productloyalty::findOrFail($id);

        // Update the loyalty amount
        $productLoyalty->update($data);

        // Return a successful response with the updated product loyalty
        return response()->json(['message' => 'Loyalty updated successfully', 'data' => $productLoyalty], 200);
    }


    public function destroy($id)
    {
        // Find the product loyalty record by id
        $productLoyalty = productloyalty::findOrFail($id);

        // Delete the product loyalty record
        $productLoyalty->delete();

        // Return a successful response
        return response()->json(['message' => 'Product loyalty deleted successfully'], 200);
    }
}
