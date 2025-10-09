<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AssignClient;
use App\Models\Distrubutrer;
use App\Models\User;
// use Illuminate\Container\Attributes\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
class DistrubuterController extends Controller
{

    public function index()
    {
        return Distrubutrer::with('userdist')->get();
    }

    public function count(){
        return Distrubutrer::with('user')->count();
    }


    public function store(Request $request)
    {

        $authorization = request()->server('HTTP_AUTHORIZATION');


        try {
            // Authenticate the user using the token
            $customer = JWTAuth::parseToken()->authenticate();

            if (!$customer) {
                return response()->json(['error' => 'User not authenticated'], 401);
            }



            if (!$customer) {
                return response()->json(['error' => 'User not authenticated'], 401);
            }
    
            // 🔥 Check if email already exists
            if (User::where('email', $request->email)->exists()) {
                return response()->json([
                    'success' => false,
                    'message' => 'This email address is already registered.',
                ], 409); // 409 Conflict
            }



            $request->validate([
                'company_name' => 'required',
                'company_logo' => 'nullable',
                'address' => 'required',
                'phone' => 'required',
                'website' => 'required',
                'email' => 'required|email',
                'commission'=>'nullable',
                'pan_number' => 'required',
                'gst_number' => 'nullable',
                'ifsc_code' => 'required',
                'bank_name' => 'required',
                'account_number' => 'required',
                'account_holder_name' => 'required',
                'account_type' => 'required',
                'status' => 'required',
            ]);

            $user=new User();
            $user->name=$request->name;
            $user->email=$request->email;
            $user->password=bcrypt($request->password);
            $user->status=1;
            $user->save();
            Log::info('Authenticated Customer:', ['user' => $user]);

            // Create the distributor and associate it with the authenticated user
            $distributor = Distrubutrer::create(array_merge(
                $request->all(),
                [
                    'created_by' => $customer->id,
                    'user_id' => $user->id,

                    ]
            ));

            // Assign the 'distributor' role to the authenticated user
            $user->assignRole('distributor');
            // if (!$customer->hasRole('distributor')) {
            //     $customer->assignRole('distributor');
            //     Log::info('Assigned distributor role to customer.', ['user_id' => $customer->id]);
            // }
           
            // Return a success response
            return response()->json([
                'message' => 'Distributor created successfully',
                'data' => $distributor,
            ], 201);
        } catch (\Tymon\JWTAuth\Exceptions\TokenExpiredException $e) {
            return response()->json(['error' => 'Token expired'], 401);
        } catch (\Tymon\JWTAuth\Exceptions\TokenInvalidException $e) {
            return response()->json(['error' => 'Token is invalid'], 401);
        } catch (\Tymon\JWTAuth\Exceptions\JWTException $e) {
            return response()->json(['error' => 'Token not provided'], 401);
        } catch (\Exception $e) {
            // Catch other exceptions and log the error

            return response()->json(['error' => 'An error occurred while processing your request'], 500);
        }
    }



    public function show($id)
    {
        $distrubuter = Distrubutrer::find($id);

        if (!$distrubuter) {
            return response()->json(['message' => 'Distrubuter not found'], 404);
        }

        return response()->json($distrubuter);
    }

    // public function update(Request $request, $id)
    // {
    //     $distrubuter = Distrubutrer::find($id);

    //     if (!$distrubuter) {
    //         return response()->json(['message' => 'Distrubuter not found'], 404);
    //     }

    //     $request->validate([
    //         'company_name' => 'required',
    //         'company_logo' => 'required',
    //         'address' => 'required',
    //         'phone' => 'required',
    //         'website' => 'required',
    //         'email' => 'required|email',
    //         'commission'=>'required',
    //         'pan_number' => 'required',
    //         'gst_number' => 'required',
    //         'ifsc_code' => 'required',
    //         'bank_name' => 'required',
    //         'account_number' => 'required',
    //         'account_holder_name' => 'required',
    //         'account_type' => 'required',
    //         'status' => 'required',
    //     ]);

    //     $distrubuter->update($request->all());
    //     return response()->json($distrubuter);
    // }
    // public function destroy($id)
    // {
    //     $distrubuter = Distrubutrer::findOrFail($id);
    //     $distrubuter->delete();
    // }

//distributlor issues update 
public function update(Request $request, $id)
{
    \Log::info($request->all());

    // Find the distributor
    $distrubuter = Distrubutrer::find($id);
    if (!$distrubuter) {
        return response()->json(['message' => 'Distrubuter not found'], 404);
    }

    $data = $request->all();

    // Update associated user
    $user = User::find($distrubuter->user_id);
    if ($user) {
        // Check email uniqueness
        if ($request->filled('email') && $request->email !== $user->email) {
            $exists = User::where('email', $request->email)->where('id', '!=', $user->id)->exists();
            if ($exists) {
                return response()->json([
                    'success' => false,
                    'message' => 'Email already exists.',
                ], 422);
            }
            $user->email = $request->email;
        }

        // Update name
        $user->name = $request->company_name ?? $user->name;

        // Update password if provided
        // if (!empty($data['password'])) {
        //     $user->password = \Hash::make($data['password']);
        // }

        $user->save();

        // Sync role if provided
        // if (isset($data['roleClient'])) {
        //     $user->syncRoles([$data['roleClient']]);
        // }
    }

    // Update distributor
    $distrubuter->update($data);
    return response()->json($distrubuter);

   
}




public function destroy($id)
{
    DB::beginTransaction();

    try {
        $distributor = Distrubutrer::findOrFail($id);

        $userId = $distributor->user_id;

        // Delete distributor first to prevent foreign key constraint error
        $distributor->delete();

        // Then delete the user if exists
        if ($userId) {
            $user = User::find($userId);

            if ($user) {
                // Delete related coni_purchases first
                $user->coniPurchases()->delete();

                // Now delete user
                $user->delete();
            }
        }

        DB::commit();

        return response()->json([
            'success' => true,
            'message' => 'Distributor and related user data deleted successfully.'
        ]);
    } catch (\Exception $e) {
        DB::rollBack();

        \Log::error('Distributor deletion failed: ' . $e->getMessage());

        return response()->json([
            'success' => false,
            'message' => 'Distributor deletion failed.',
            'error' => $e->getMessage()
        ], 500);
    }
}

    public function assign(Request $request)
    {
    //    dd($request->all());
        

        AssignClient::create($request->all());

        return response()->json(['message' => 'Client assigned to distributor successfully!'], 201);
    }
}
