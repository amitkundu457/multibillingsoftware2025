<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Master;
use Illuminate\Http\Request;


use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Log;

class MasterSettingController extends Controller
{


    public function show()
{
    // $customer = JWTAuth::parseToken()->authenticate();
    // Log::info('Authenticated Customer:', ['customer' => $customer]);

    $master = Master::first(); // Fetch the first or only record

    return response()->json([
        'logo_url' => $master && $master->logo ? asset('storage/' . $master->logo) : null,
    ]);
}
// 
    public function store(Request $request)
{
    // dd($request->all());
    // // Validate the request to ensure only valid image files are uploaded
    // $validatedData = $request->validate([
    //     'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', // Limit file types and size
    // ]);

    // Initialize file path variable
    $filePath = null;

    // Check if a file was uploaded
    if ($request->hasFile('logo')) {
        $file = $request->file('logo');
        
        // Generate a unique filename to avoid overwriting existing files
        $fileName = uniqid() . '.' . $file->getClientOriginalExtension();

        // Store the file in the 'logos' directory of the public disk
        $filePath = $file->storeAs('logos', $fileName, 'public');
    }

    // Create a new record in the database
    $master = Master::create([
        'logo' => $filePath,
    ]);

    // Return a JSON response with the created resource and file URL
    return response()->json([
        'message' => 'Image uploaded and saved successfully!',
        'data' => [
            'id' => $master->id,
            'logo_url' => $filePath ? asset('storage/' . $filePath) : null,
        ],
    ], 201);
}



public function update(Request $request)
{
    // Fetch the first or only record
    $master = Master::first();

    // Return an error response if no record exists
    if (!$master) {
        return response()->json([
            'message' => 'No record found to update.',
        ], 404);
    }

    // Check if a new file is uploaded
    if ($request->hasFile('logo')) {
        $file = $request->file('logo');
        $fileName = uniqid() . '.' . $file->getClientOriginalExtension();
        $filePath = $file->storeAs('logos', $fileName, 'public');

        // Update the logo path
        $master->logo = $filePath;
        $master->save();

        return response()->json([
            'message' => 'Logo updated successfully!',
            'data' => [
                'logo_url' => asset('storage/' . $filePath),
            ],
        ], 200);
    }

    return response()->json([
        'message' => 'No file uploaded.',
    ], 400);
}


}
