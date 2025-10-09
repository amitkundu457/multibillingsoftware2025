<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SaleProduct;
use Illuminate\Http\Request;

class SaleProductController extends Controller
{
    // Retrieve all sale products
    public function index()
    {
        $products = SaleProduct::all();
        return response()->json($products);
    }

    // Create a new sale product
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'amount' => 'required|numeric',
        ]);

        $product = SaleProduct::create([
            'name' => $request->name,
            'amount' => $request->amount,
        ]);

        return response()->json($product, 201); // Return the created product
    }

    // Retrieve a single sale product by id
    public function show($id)
    {
        $product = SaleProduct::find($id);

        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        return response()->json($product);
    }

    // Update a sale product by id
    public function update(Request $request, $id)
    {
        $product = SaleProduct::find($id);

        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'amount' => 'required|numeric',
        ]);

        $product->update([
            'name' => $request->name,
            'amount' => $request->amount,
        ]);

        return response()->json($product);
    }

    // Delete a sale product by id
    public function destroy($id)
    {
        $product = SaleProduct::find($id);

        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        $product->delete();
        return response()->json(['message' => 'Product deleted successfully']);
    }
}
