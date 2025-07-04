<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::all();
        return response()->json($products);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|',
            'image' => 'required|file|mimes:jpg,jpeg,png,gif|max:2048', // Ensure it's a valid file
            // 'description' => 'required|string',
            'amount' => 'required',
        ]);

        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $fileName = time() . '_' . $file->getClientOriginalName();
            $filePath = 'products/'; // Directory under public
            $file->move(public_path($filePath), $fileName);
            $validated['image'] = $filePath . $fileName;
        }

        // Create the product with the validated data
        $product = Product::create($validated);

        return response()->json(['message' => 'Product created successfully', 'product' => $product], 201);
    }


    public function update(Request $request, $id)
    {
        // Find the product by ID
        $product = Product::find($id);
        \Log::info($product);

        // Check if the product exists
        if (!$product) {
            return response()->json(['error' => 'Product not found.'], 404);
        }

        // Validate the input
        $validated = $request->validate([
            'title' => 'string|max:255',
            'image' => 'string|max:255',
            'amount' => 'string|max:255',
            // 'description' => 'string',
        ]);

        // Handle the image upload
        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $fileName = time() . '_' . $file->getClientOriginalName();
            $filePath = 'products/'; // Directory under public
            $file->move(public_path($filePath), $fileName); // Save to public/products directory

            // Delete the old image if it exists
            if ($product->image && file_exists(public_path($product->image))) {
                unlink(public_path($product->image));
            }

            // Add the new image path to validated data
            $validated['image'] = $filePath . $fileName;
        }

        // Update the product with validated data
        $product->update($validated);

        return response()->json(['message' => 'Product updated successfully', 'product' => $product]);
    }



    public function show(Product $product)
    {
        return response()->json($product);
    }

    public function destroy(Product $product)
    {
        // Optionally delete the associated image file if it exists
        if ($product->image && file_exists(public_path($product->image))) {
            unlink(public_path($product->image));
        }

        // Delete the product record from the database
        $product->delete();

        return response()->json(['message' => 'Product deleted successfully']);
    }
}
