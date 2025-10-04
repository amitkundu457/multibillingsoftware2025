<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AssignClient;
use App\Models\Distrubutrer;
use App\Models\User;
use App\Models\UserInfo;
use App\Models\UserInformation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class UserInfoController extends Controller
{
    /**
     * Fetch all user information.
     */
    public function index()
    {
        $users = UserInformation::with(['users', 'prods', 'distributor.user'])
            ->orderBy('created_at', 'desc') // Sort by 'created_at' in descending order
            ->get();
        // $userInfo = UserInformation::whereNotNull('dist_id')->with('distributor')->first();
        // dd($userInfo);
        return response()->json(['success' => true, 'data' => $users], 200);
    }

    public function count()
    {
        return UserInformation::with(['users'])->count();
    }



    // public function store(Request $request)
    // {
    //     // Log::info($request->all());
    //     $data = $request->all();

    //     // Hash the password before saving, if provided
    //     if (isset($data['password'])) {
    //         $data['password'] = Hash::make($data['password']);
    //     }

    //     $request->validate([
    //         'email' => 'required|email|unique:users,email',
    //     ]);

    //     // Create a record in the users table first
    //     $user = User::create([
    //         'name' => ($data['first_name'] ?? '') . ' ' . ($data['last_name'] ?? ''), // Combine first and last name
    //         'email' => $data['email'] ?? '',
    //         'password' => $data['password'] ?? '', // Ensure password is set
    //     ]);

    //     // Assign role to the user
    //     Log::info($request['roleClient']);
       
    //     if (isset($request['roleClient'])) {
    //         $user->assignRole($request['roleClient']);
    //     }
    //     //  dd($request['roleClient']);
    //     $slug = Str::slug(($data['first_name'] ?? '') . '-' . ($data['last_name'] ?? '') . '-' . Str::random(6));
    //     // Add the user_id to the data array for UserInformation
    //     $data['user_id'] = $user->id;
    //     $data['slug'] = $slug;
    //     // Create the record in the user_infos table
    //     $userInfo = UserInformation::create($data);
       

    //     return response()->json([
    //         'success' => true,
    //         'message' => 'User successfully created in both tables.',
    //         'data' => [
    //             'user_info' => $userInfo,
    //             'user' => $user,
    //         ],
    //     ], 201);
    // }
// update this after for uniqness
public function store(Request $request)
{
    $data = $request->all();

    // 🔥 ADD THIS: Check if the email already exists before validation or creation
    if (isset($data['email']) && User::where('email', $data['email'])->exists()) {
        return response()->json([
            'success' => false,
            'message' => 'This email address is already registered.',
        ], 409); // 409 Conflict
    }

    // ✅ EXISTING VALIDATION (you can now simplify this since you checked uniqueness above)
    $request->validate([
        'email' => 'required|email',
        'password' => 'required|min:6', // recommended: validate password presence/length
    ]);

    // ✅ EXISTING PASSWORD HASHING
    if (isset($data['password'])) {
        $data['password'] = Hash::make($data['password']);
    }

    // ✅ EXISTING USER CREATION
    $user = User::create([
        'name' => ($data['first_name'] ?? '') . ' ' . ($data['last_name'] ?? ''),
        'email' => $data['email'] ?? '',
        'password' => $data['password'] ?? '',
    ]);

    // ✅ ROLE ASSIGNMENT
    if (isset($request['roleClient'])) {
        $user->assignRole($request['roleClient']);
    }

    // ✅ GENERATE SLUG AND CREATE USER INFO
    $slug = Str::slug(($data['first_name'] ?? '') . '-' . ($data['last_name'] ?? '') . '-' . Str::random(6));
    $data['user_id'] = $user->id;
    $data['slug'] = $slug;

    $userInfo = UserInformation::create($data);

    return response()->json([
        'success' => true,
        'message' => 'User successfully created in both tables.',
        'data' => [
            'user_info' => $userInfo,
            'user' => $user,
        ],
    ], 201);
}



    /**
     * Update an existing user information.
     */
    // public function update(Request $request, $id)
    // {
    //     Log::info($request->all());
    //     if ($request->filled('email')) {
    //         $request->validate([
    //             'email' => 'email|unique:users,email,' . $id,
    //         ]);
    //     }
       
    //     // Retrieve user by the user_id
    //     $user = User::find($id);
    //     if (!$user) {
    //         return response()->json([
    //             'success' => false,
    //             'message' => 'User not found.',
    //         ], 404);
    //     }

    //     // Update user table
    //     $data = $request->all();

    //     // Hash the password before saving, if provided
    //     if (isset($data['password'])) {
    //         $data['password'] = Hash::make($data['password']);
    //     }

    //     // Update the user record
    //     $user->update([
    //         'name' => ($data['first_name'] ?? '') . ' ' . ($data['last_name'] ?? ''), // Combine first and last name
    //         'email' => $data['email'] ?? '',
    //         'password' => $data['password'] ?? '', // Ensure password is set
    //     ]);

    //     // Update user role if provided
    //     if (isset($data['roleClient'])) {
    //         $user->syncRoles([$data['roleClient']]);
    //     }

    //     // Update user_information table
    //     $userInfo = UserInformation::where('user_id', $id)->first();
    //     if ($userInfo) {
    //         $userInfo->update($data);
    //     } else {
    //         // If no record exists for user_info, create one
    //         $data['user_id'] = $user->id;
    //         $userInfo = UserInformation::create($data);
    //     }

    //     return response()->json([
    //         'success' => true,
    //         'message' => 'User and user information successfully updated.',
    //         'data' => [
    //             'user_info' => $userInfo,
    //             'user' => $user,
    //         ],
    //     ], 200);
    // }
    public function update(Request $request, $id)
{
    Log::info($request->all());

    // Find the user
    $user = User::find($id);
    if (!$user) {
        return response()->json([
            'success' => false,
            'message' => 'User not found.',
        ], 404);
    }
    Log::info( $user);

    $data = $request->all();

    // Check email logic
    if ($request->filled('email')) {
        if ($request->email !== $user->email) {
            // Email is being changed – check uniqueness
            $exists = User::where('email', $request->email)->where('id', '!=', $id)->exists();
            if ($exists) {
                return response()->json([
                    'success' => false,
                    'message' => 'Email already exists.',
                ], 422);
            }
            // Update email if unique
            $user->email = $request->email;
        }
    }

    // Update name
    $user->name = trim(($data['first_name'] ?? '') . ' ' . ($data['last_name'] ?? ''));

    // Update password if provided
    if (!empty($data['password'])) {
        $user->password = Hash::make($data['password']);
    }

    $user->save();

    // Update role if provided
    if (isset($data['roleClient'])) {
        $user->syncRoles([$data['roleClient']]);
    }

    // Update or create user information
    $userInfo = UserInformation::updateOrCreate(
        ['user_id' => $user->id],
        $data
    );

    return response()->json([
        'success' => true,
        'message' => 'User and user information successfully updated.',
        'data' => [
            'user' => $user,
            'user_info' => $userInfo,
        ],
    ]);
}



    /**
     * Delete user information.
     */
    // public function destroy($id)
    // {
    //     $user = UserInformation::findOrFail($id);

    //     $user->delete();

    //     return response()->json(['success' => true, 'message' => 'User information deleted successfully.'], 200);
    // }
//     public function destroy($id)
// {
//     $userInfo = UserInformation::findOrFail($id);

//     // Delete the associated user
//     if ($userInfo->user_id) {
//         $user = User::find($userInfo->user_id);
//         if ($user) {
//             $user->delete();
//         }
//     }

//     // Delete the user information record
//     $userInfo->delete();

//     return response()->json([
//         'success' => true,
//         'message' => 'User information and associated user deleted successfully.'
//     ], 200);
// }




public function destroy($id)
{
    DB::beginTransaction();

    try {
        $userInfo = UserInformation::findOrFail($id);

        if ($userInfo->user_id) {
            $user = User::find($userInfo->user_id);

            if ($user) {
                // Delete related coni_purchases first
                $user->coniPurchases()->delete();

                // Now delete user
                $user->delete();
            }
        }

        $userInfo->delete();

        DB::commit();

        return response()->json([
            'success' => true,
            'message' => 'User and related data deleted successfully.'
        ]);
    } catch (\Exception $e) {
        DB::rollBack();

        \Log::error('Delete failed: ' . $e->getMessage());

        return response()->json([
            'success' => false,
            'message' => 'Deletion failed.',
            'error' => $e->getMessage()
        ], 500);
    }
}



    /**
     * Fetch a specific user information by ID.
     */
    public function show($id)
    {
        $user = UserInfo::findOrFail($id);

        return response()->json(['success' => true, 'data' => $user], 200);
    }

    public function distributersearch(Request $request)
    {
        $query = $request->input('query');

        // Fetch distributors with their related user data
        $distributors = Distrubutrer::with('userdist')
            ->where('phone', 'LIKE', "%$query%")
            ->get();

        // Check if data exists
        if ($distributors->isEmpty()) {
            return response()->json(['data' => [], 'message' => 'No distributors found'], 404);
        }

        // Return the data as a JSON response
        return response()->json(['data' => $distributors], 200);
    }



    public function distributerassignclient()
    {
        $customer = JWTAuth::parseToken()->authenticate();
        // dd($customer);
        return AssignClient::join('users as clients', 'clients.id', '=', 'assign_clients.client_id')
            ->join('user_information', 'user_information.user_id', '=', 'assign_clients.client_id')
            ->join('users as disbs', 'disbs.id', '=', 'assign_clients.distributor_id')
            ->leftJoin('products', 'user_information.product_id', '=', 'products.id')
            ->select(
                'clients.name as cname',
                'disbs.name',
                'clients.email as cemail',
                'user_information.mobile_number',
                'products.title as pname',
                'clients.id',
                'clients.status',
                \DB::raw('CAST(clients.status AS UNSIGNED) as status')
            )
            ->where('assign_clients.distributor_id', $customer->id)->get();
    }
    public function ApproveStatus($id)
    {
        // Find the user record based on the user_id in user_information
        $userInfo = UserInformation::where('user_id', $id)->first();

        if (!$userInfo) {
            return response()->json(['message' => 'User information not found'], 404);
        }

        // Fetch the user model and update status
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $user->status = 1;
        $user->save();

        return response()->json([
            'message' => 'Status updated successfully',
            'status' => $user->status
        ]);
    }

    public function RejectStatus($id)
    {
        // Find the user record based on the user_id in user_information
        $userInfo = UserInformation::where('user_id', $id)->first();

        if (!$userInfo) {
            return response()->json(['message' => 'User information not found'], 404);
        }

        // Fetch the user model and update status
        $user = User::find($id);

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        $user->status = 0;
        $user->save();

        return response()->json([
            'message' => 'Status updated successfully',
            'status' => $user->status
        ]);
    }

    public function getShopBySlug(Request $request,$slug)
    {
        $shop = UserInformation::where('slug', $slug)->first();
        \Log::info($shop);

        return response()->json($shop, 200);
    }
}
