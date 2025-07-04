<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\QrImage;
use App\Models\CoverImage;
use App\Models\MastersBill;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Log;

use Illuminate\Support\Facades\Storage;


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



    public function storeCover(Request $request)
{
    $user = JWTAuth::parseToken()->authenticate();

    $request->validate([
        'cover' => 'required|image|mimes:jpg,jpeg,png,gif|max:2048',
    ]);

    $existing = CoverImage::where('created_by', $user->id)->first();

    if ($existing) {
        if ($existing->cover && Storage::disk('public')->exists($existing->cover)) {
            Storage::disk('public')->delete($existing->cover);
        }

        $existing->delete();
    }

    $file = $request->file('cover');
    $fileName = uniqid() . '.' . $file->getClientOriginalExtension();
    $filePath = $file->storeAs('cover', $fileName, 'public');

    $coverImage = CoverImage::create([
        'cover' => $filePath,
        'created_by' => $user->id,
        'type'=>'cover',
    ]);

    return response()->json([
        'message' => $existing ? 'Old image replaced successfully!' : 'New cover image uploaded successfully!',
        'data' => [
            'id' => $coverImage->id,
            'cover' => asset('storage/' . $filePath),
        ],
    ], 201);
}

//get api for cover image
public function getCover(Request $request)
{
    $user = JWTAuth::parseToken()->authenticate();

    $coverImage = CoverImage::where('created_by', $user->id)
    ->where('type','cover')
    ->first();

    if (!$coverImage) {
        return response()->json([
            'message' => 'No cover image found for this user.',
            'data' => null,
        ], 404);
    }

    return response()->json([
        'message' => 'Cover image retrieved successfully.',
        'data' => [
            'id' => $coverImage->id,
            'cover' => asset('storage/' . $coverImage->cover),
        ],
    ]);
}


//Qr image
public function storeQr(Request $request)
{
    $user = JWTAuth::parseToken()->authenticate();

    $request->validate([
        'cover' => 'required|image|mimes:jpg,jpeg,png,gif|max:2048',
    ]);

    $existing = QrImage::where('created_by', $user->id)->first();

    if ($existing) {
        if ($existing->cover && Storage::disk('public')->exists($existing->cover)) {
            Storage::disk('public')->delete($existing->cover);
        }

        $existing->delete();
    }

    $file = $request->file('cover');
    $fileName = uniqid() . '.' . $file->getClientOriginalExtension();
    $filePath = $file->storeAs('qrimage', $fileName, 'public');

    $coverImage = QrImage::create([
        'cover' => $filePath,
        'created_by' => $user->id,
        'type'=>'cover',
    ]);

    return response()->json([
        'message' => $existing ? 'Old image replaced successfully!' : 'New cover image uploaded successfully!',
        'data' => [
            'id' => $coverImage->id,
            'cover' => asset('storage/' . $filePath),
        ],
    ], 201);
}


//qr image get fuction
// public function getqr(Request $request)
// {
    
//     $coverImage=QrImage::find()->first();

//     if (!$coverImage) {
//         return response()->json([
//             'message' => 'No cover image found for this user.',
//             'data' => null,
//         ], 404);
//     }

//     return response()->json([
//         'message' => 'Cover image retrieved successfully.',
//         'data' => [
//             'id' => $coverImage->id,
//             'cover' => asset('storage/' . $coverImage->cover),
//         ],
//     ]);
// }
public function getqr(Request $request)
{
    // Retrieve the first QR image record
    $coverImage = QrImage::first(); // Removed ->find(), which requires an ID

    if (!$coverImage) {
        return response()->json([
            'message' => 'No QR image found.',
            'data' => null,
        ], 404);
    }

    return response()->json([
        'message' => 'QR image retrieved successfully.',
        'data' => [
            'id' => $coverImage->id,
            'cover' => asset('storage/' . $coverImage->cover), // make sure 'cover' is the correct column name
        ],
    ]);
}


//roler 
public function clientRoleWiseDetails()
{
    $roles = Role::whereIn('name', ['jwellery','resturant','saloon'])->get();

    $data = [];

    foreach ($roles as $role) {
        $users = User::role($role->name)
            ->select('id', 'name', 'email','status') // Add more fields if needed
            ->get();

        $data[] = [
            'role' => $role->name,
            'users' => $users
        ];
    }

    return response()->json($data);
}


}
