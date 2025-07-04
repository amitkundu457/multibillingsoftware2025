<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BillCount;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
class BillCountController extends Controller
{
    //

     // List all bill counts (admin only use case)
     public function index()
     {
        $user = JWTAuth::parseToken()->authenticate();
        $billCount = BillCount::where('created_by', $user->id)->first();

        return response()->json(['bill_count' => $billCount], 200);
     }
 
     // Show a specific user's bill count
     public function show()
     {
         $user = JWTAuth::parseToken()->authenticate();
         $billCount = BillCount::where('created_by', $user->id)->first();
 
         return response()->json(['bill_count' => $billCount], 200);
     }
 
     // Create or increment the bill count
     public function increment(Request $request)
     {
         // Authenticate customer using JWT
         $customer = JWTAuth::parseToken()->authenticate();
         Log::info('Authenticated Customer:', ['customer' => $customer]);
     
         // Validate the request to ensure bill_count is present and is an integer
         $request->validate([
             'bill_count' => 'required|integer|min:0',
         ]);
     
         $billCountValue = $request->input('bill_count');
     
         // Find or create the record
         $billCount = BillCount::firstOrCreate(
             ['created_by' => $customer->id],
             ['bill_count' => 0]
         );
     
         // Update the bill_count to the value from the request (overwrite, not add)
         $billCount->bill_count = $billCountValue;
         $billCount->save();
     
         return response()->json([
             'message' => 'Bill count set successfully',
             'bill_count' => $billCount->bill_count,
             'created_by' => $customer->id,
         ]);
     }
     
     
 
     // Update bill count manually (if needed)
     public function update(Request $request)
{
    $customer = JWTAuth::parseToken()->authenticate();
    Log::info('Authenticated Customer:', ['customer' => $customer]);

    // Validate input
    $request->validate([
        'id' => 'required|integer|exists:users,id', // id here is the user_id (created_by)
        'bill_count' => 'required|integer|min:0',
    ]);

    // Find BillCount record by created_by (not by primary key)
    $billCount = BillCount::where('created_by', $request->id)->first();

    if (!$billCount) {
        return response()->json([
            'message' => 'Bill count record not found for the given user ID.'
        ], 404);
    }

    // Optional: Check if the logged-in user has permission to update this
    // You can skip this check if admins can update any
    if ($customer->id !== $request->id) {
        return response()->json([
            'message' => 'Unauthorized to update bill count for this user.'
        ], 403);
    }

    // Update the bill_count
    $billCount->bill_count = $request->bill_count;
    $billCount->save();

    return response()->json([
        'message' => 'Bill count updated successfully',
        'bill_count' => $billCount->bill_count,
        'created_by' => $billCount->created_by
    ]);
}

 
     // Optional delete
     public function destroy()
     {
         $user = JWTAuth::parseToken()->authenticate();
 
         BillCount::where('created_by', $user->id)->delete();
 
         return response()->json(['message' => 'Bill count deleted']);
     }

}
