<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    public function index()
    {
        $services = Service::all();
        return response()->json($services);
    }

    // Create a new service
    public function store(Request $request)
    {
        $validated = $request->validate([
            'image' => 'required|file|mimes:jpg,jpeg,png,gif|max:2048', // Ensure it's a valid file
        ]);

        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $fileName = time() . '_' . $file->getClientOriginalName();
            $filePath = 'services/'; // Directory under public
            $file->move(public_path($filePath), $fileName);

            $validated['image'] = $filePath . $fileName;
        }

        $service = Service::create($validated);

        return response()->json(['message' => 'Service created successfully', 'service' => $service], 201);
    }

    // Update an existing service
    public function update(Request $request, $id)
    {
        // Find the service by ID
        $service = Service::find($id);

        // Check if the service exists
        if (!$service) {
            return response()->json(['error' => 'Service not found.'], 404);
        }

        // Validate the request data
        $validated = $request->validate([
            'image' => 'nullable|file|mimes:jpg,jpeg,png,gif|max:2048',
        ]);

        if ($request->hasFile('image')) {
            // Delete the old image if it exists
            if ($service->image && file_exists(public_path($service->image))) {
                unlink(public_path($service->image));
            }

            // Upload the new image
            $file = $request->file('image');
            $fileName = time() . '_' . $file->getClientOriginalName();
            $filePath = 'services/';
            $file->move(public_path($filePath), $fileName);

            // Add the new image path to the validated data
            $validated['image'] = $filePath . $fileName;
        }

        // Update the service with validated data
        $service->update($validated);

        return response()->json(['message' => 'Service updated successfully', 'service' => $service]);
    }


    // Delete a service
    public function destroy(Service $service)
    {
        if ($service->image && file_exists(public_path($service->image))) {
            unlink(public_path($service->image));
        }

        $service->delete();

        return response()->json(['message' => 'Service deleted successfully']);
    }

    // Show a single service
    public function show(Service $service)
    {
        return response()->json($service);
    }
}
