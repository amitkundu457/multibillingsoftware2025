<?php

namespace App\Http\Controllers;

use App\Models\MastersBill;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

use Tymon\JWTAuth\Facades\JWTAuth;


class MastersBillController extends Controller
{
    /**
     * Fetch the latest logo.
     */
    // public function show()
    // {
    //     $customer = JWTAuth::parseToken()->authenticate();
    // Log::info('Authenticated Customer:', ['customer' => $customer]);

    //     $mastersBill = MastersBill::latest()->first(); // Fetch latest record
    
    //     return response()->json([
    //         'id' => $mastersBill ? $mastersBill->id : null,
    //         'logo' => $mastersBill && $mastersBill->logo 
    //             ? asset('storage/' . $mastersBill->logo)  // Convert to full URL
    //             : null,
    //     ]);
    // }
    
    public function show()
{
    $customer = JWTAuth::parseToken()->authenticate();
    Log::info('Authenticated Customer:', ['customer' => $customer]);

    // Fetch latest record created by the authenticated customer
    $mastersBill = MastersBill::where('created_by', $customer->id)
                              ->latest()
                              ->first();

    return response()->json([
        'id' => $mastersBill ? $mastersBill->id : null,
        'logo' => $mastersBill && $mastersBill->logo 
            ? asset('storage/' . $mastersBill->logo)
            : null,
    ]);
}


    /**
     * Store or update the logo.
     */
    // public function store(Request $request)
    // {
    //     // Validate image upload
    //     $request->validate([
    //         'logo' => 'nullable|image|mimes:jpg,jpeg,png,gif|max:2048', 
    //     ]);
    
    //     $filePath = null;
    
    //     if ($request->hasFile('logo')) {
    //         $file = $request->file('logo');
    //         $fileName = uniqid() . '.' . $file->getClientOriginalExtension();
    //         $filePath = $file->storeAs('logos', $fileName, 'public');
    //     }
    
    //     // Delete the old logo before inserting a new one (ensuring only 1 logo exists)
    //     MastersBill::query()->delete();
    
    //     // Insert new logo into the table
    //     $mastersBill = MastersBill::create(['logo' => $filePath]);
    
    //     return response()->json([
    //         'message' => 'Image uploaded and saved successfully!',
    //         'data' => [
    //             'id' => $mastersBill->id,
    //             'logo' => $filePath ? asset('storage/' . $filePath) : null,
    //         ],
    //     ], 201);
    // }
    

    public function store(Request $request)
{
    $customer = JWTAuth::parseToken()->authenticate();

    // Validate image upload
    $request->validate([
        'logo' => 'nullable|image|mimes:jpg,jpeg,png,gif|max:2048', 
    ]);

    $filePath = null;

    if ($request->hasFile('logo')) {
        $file = $request->file('logo');
        $fileName = uniqid() . '.' . $file->getClientOriginalExtension();
        $filePath = $file->storeAs('logos', $fileName, 'public');
    }

    // Delete the old logo before inserting a new one (ensuring only 1 logo exists)
    MastersBill::query()->delete();

    // Insert new logo into the table with created_by
    $mastersBill = MastersBill::create([
        'logo' => $filePath,
        'created_by' => $customer->id,
    ]);

    return response()->json([
        'message' => 'Image uploaded and saved successfully!',
        'data' => [
            'id' => $mastersBill->id,
            'logo' => $filePath ? asset('storage/' . $filePath) : null,
        ],
    ], 201);
}

    /**
     * Update an existing logo.
     */
    public function update(Request $request, $id)
    {
        Log::info('🟠 Update method called');

        $bill = MastersBill::find($id);
        if (!$bill) {
            Log::error('❌ Bill not found');
            return response()->json(['message' => 'Bill not found'], 404);
        }

        if ($request->hasFile('logo')) {
            // Store new file
            $file = $request->file('logo');
            $fileName = uniqid() . '.' . $file->getClientOriginalExtension();
            $filePath = $file->storeAs('logos', $fileName, 'public');

            Log::info('📂 New file stored at: ' . $filePath);

            // Delete old file
            if ($bill->logo) {
                Storage::disk('public')->delete($bill->logo);
                Log::info('🗑️ Old logo deleted');
            }

            // Update database
            $bill->update(['logo' => $filePath]);

            return response()->json([
                'message' => 'Logo updated successfully!',
                'data' => [
                    'id' => $bill->id,
                    'logo_url' => url('storage/' . $filePath),
                ],
            ]);
        }

        Log::error('❌ No file uploaded for update');
        return response()->json(['message' => 'No file uploaded.'], 400);
    }
}
