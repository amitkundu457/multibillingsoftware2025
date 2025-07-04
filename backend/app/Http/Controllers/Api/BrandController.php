<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Brand;

class BrandController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($request->file('image')) {
            $image = $request->file('image');
            $imageName = time() . '.' . $image->getClientOriginalExtension();
            $image->move(public_path('uploads/brands'), $imageName);

            // Save the image path in the database
            $brand = new Brand();
            $brand->image = 'uploads/brands/' . $imageName;
            $brand->save();

            return response()->json(['success' => 'Image uploaded successfully.']);
        }

        return response()->json(['error' => 'Image upload failed.'], 400);
    }

    public function update(Request $request, $id)
    {
        // Validate the input
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // Find the brand by ID
        $brand = Brand::find($id);

        // Check if the brand exists
        if (!$brand) {
            return response()->json(['error' => 'Brand not found.'], 404);
        }

        if ($request->file('image')) {
            // Delete the old image if it exists
            if (file_exists(public_path($brand->image))) {
                unlink(public_path($brand->image));
            }

            // Upload the new image
            $image = $request->file('image');
            $imageName = time() . '.' . $image->getClientOriginalExtension();
            $image->move(public_path('uploads/brands'), $imageName);

            // Update the database with the new image path
            $brand->image = 'uploads/brands/' . $imageName;
            $brand->save();

            return response()->json(['success' => 'Image updated successfully.']);
        }

        return response()->json(['error' => 'Image update failed.'], 400);
    }


    public function destroy($id)
    {
        $brand = Brand::findOrFail($id);

        // Delete the image from the public folder
        if (file_exists(public_path($brand->image))) {
            unlink(public_path($brand->image));
        }

        // Delete the database record
        $brand->delete();

        return response()->json(['success' => 'Image deleted successfully.']);
    }

    public function index()
    {
        return Brand::all();
    }
}
