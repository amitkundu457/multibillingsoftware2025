<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Slider;
use Illuminate\Http\Request;

class SliderController extends Controller
{
    public function index()
    {
        $sliders = Slider::all();
        return response()->json($sliders);
    }

    // Create a new slider
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'image' => 'required|file|mimes:jpg,jpeg,png,gif',
        ]);

        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $fileName = time() . '_' . $file->getClientOriginalName();
            $filePath = 'sliders/';
            $file->move(public_path($filePath), $fileName);

            $validated['image'] = $filePath . $fileName;
        }

        $slider = Slider::create($validated);

        return response()->json(['message' => 'Slider created successfully', 'slider' => $slider], 201);
    }

    // Update an existing slider
    public function update(Request $request, $id = null)
    {
        // Validate the request data
        $validated = $request->validate([
            'title' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|file|mimes:jpg,jpeg,png,gif|max:2048',
        ]);

        // Find the slider by ID if provided
        $slider = $id ? Slider::find($id) : null;

        if ($id && !$slider) {
            return response()->json(['error' => 'Slider not found.'], 404);
        }

        // Handle the image upload
        if ($request->hasFile('image')) {
            // Delete old image if updating
            if ($slider && $slider->image && file_exists(public_path($slider->image))) {
                unlink(public_path($slider->image));
            }

            $file = $request->file('image');
            $fileName = time() . '_' . $file->getClientOriginalName();
            $filePath = 'sliders/';
            $file->move(public_path($filePath), $fileName);

            $validated['image'] = $filePath . $fileName;
        }

        if ($slider) {
            // Update the existing slider
            $slider->update($validated);
            $message = 'Slider updated successfully.';
        } else {
            // Create a new slider
            $slider = Slider::create($validated);
            $message = 'Slider created successfully.';
        }

        return response()->json(['message' => $message, 'slider' => $slider]);
    }


    // Delete a slider
    public function destroy(Slider $slider)
    {
        if ($slider->image && file_exists(public_path($slider->image))) {
            unlink(public_path($slider->image));
        }

        $slider->delete();

        return response()->json(['message' => 'Slider deleted successfully']);
    }

    // Show a single slider
    public function show(Slider $slider)
    {
        return response()->json($slider);
    }
}
