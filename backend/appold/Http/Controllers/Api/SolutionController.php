<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Solution;
use Illuminate\Http\Request;

class SolutionController extends Controller
{
   

public function index(){
    return Solution::all();
}

public function store(Request $request)
{
    // Validate the input, including the image file
    $request->validate([
        'image' => 'required|image|mimes:jpeg,png,jpg,gif',
        'title' => 'required|string|max:255',
        'description' => 'required|string',
        'invert' => 'nullable|boolean',
    ]);

    // Define the target path in the public folder
    $destinationPath = public_path('solutions');

    // Ensure the directory exists
    if (!file_exists($destinationPath)) {
        mkdir($destinationPath, 0777, true);
    }

    // Move the uploaded file to the public/solutions directory
    $imageFile = $request->file('image');
    $imageName = time() . '_' . $imageFile->getClientOriginalName();
    $imageFile->move($destinationPath, $imageName);

    // Save the file path relative to the public folder
    $imagePath = 'solutions/' . $imageName;

    // Create the Solution and store the image path
    $solution = Solution::create([
        'image' => $imagePath,
        'title' => $request->title,
        'description' => $request->description,
        'invert' => $request->invert,
    ]);

    return response()->json([
        'message' => 'Solution created successfully',
        'data' => $solution,
    ], 201);
}


    public function update(Request $request, $id)
    {
        // dd($request->all());
        // Find the solution by its ID
        $solution = Solution::find($id);

        if (!$solution) {
            return response()->json(['message' => 'Solution not found'], 404);
        }

        // Validate the input, including the image file if provided
        $request->validate([
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif',
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'invert' => 'sometimes|boolean',
        ]);

        // If a new image is uploaded, move it to the public folder
        if ($request->hasFile('image')) {
            // Delete the old image from the public folder if it exists
            $oldImagePath = public_path($solution->image);
            if (file_exists($oldImagePath)) {
                unlink($oldImagePath);  // Remove the old image from the public folder
            }

            // Get the uploaded file
            $file = $request->file('image');

            // Define the folder and the new filename
            $folder = 'solutions/';
            $filename = time() . '.' . $file->getClientOriginalExtension();

            // Move the file to the public folder
            $file->move(public_path($folder), $filename);

            // Update the image path in the database
            $solution->image = $folder . $filename;
        }

        // Update other fields
        $solution->title = $request->title;
        $solution->description = $request->description;
        $solution->invert = $request->invert;

        // Save the updated solution
        $solution->save();

        return response()->json([
            'message' => 'Solution updated successfully',
            'data' => $solution
        ], 200);
    }




    public function destroy($id)
    {
        $solution = Solution::find($id);

        if (!$solution) {
            return response()->json(['message' => 'Solution not found'], 404);
        }

        $solution->delete();

        return response()->json(['message' => 'Solution deleted successfully'], 200);
    }
}
