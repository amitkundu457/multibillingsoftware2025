<?php

namespace App\Http\Controllers\Api;
use App\Models\CustomerRedeemPoint;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class CustomerRedeemPointController extends Controller
{

     // Fetch all customer redeem points with only customer ID and points
     public function index()
     {
         $data = CustomerRedeemPoint::select('customer_id', 'redeem_points')->get();
         return response()->json($data);
     }


     public function store(Request $request)
{
    // Validate incoming request data
    $validated = $request->validate([
        'customer_id' => 'required', // Ensure customer exists
        'redeem_points' => 'required' // Ensure redeem points is a positive integer
    ]);

    try {
        // Check if a redeem point record already exists for the given customer
        $existingRedeemPoint = CustomerRedeemPoint::where('customer_id', $validated['customer_id'])->first();

        if ($existingRedeemPoint) {
            // If redeem points already exist, update the existing record
            $existingRedeemPoint->redeem_points += $validated['redeem_points'];
            $existingRedeemPoint->save();

            return response()->json([
                'message' => 'Redeem points updated successfully',
                'data' => $existingRedeemPoint
            ]);
        } else {
            // If no existing record, create a new one
            $redeemPoint = CustomerRedeemPoint::create([
                'customer_id' => $validated['customer_id'],
                'redeem_points' => $validated['redeem_points'],
            ]);

            return response()->json([
                'message' => 'Redeem points added successfully',
                'data' => $redeemPoint
            ], 201); // HTTP 201 for successful creation
        }
    } catch (\Exception $e) {
        // Handle errors (e.g., database errors)
        return response()->json([
            'message' => 'An error occurred while processing the request: ' . $e->getMessage()
        ], 500); // HTTP 500 for internal server error
    }
}


    public function show($customer_id)
    {
        $data = CustomerRedeemPoint::where('customer_id', $customer_id)
            ->select('customer_id', 'redeem_points')
            ->get();

        if ($data->isEmpty()) {
            return response()->json(['message' => 'No redeem points found'], 404);
        }

        return response()->json($data);
    }


    public function update(Request $request, $customer_id)
    {
        // Validate incoming request data
        $validated = $request->validate([
            'redeem_points' => 'required|integer|min:0' // Ensure redeem points is a positive integer
        ]);

        // Find the customer redeem points record
        $redeemPoint = CustomerRedeemPoint::where('customer_id', $customer_id)->first();

        // If no redeem points found for the customer
        if (!$redeemPoint) {
            return response()->json(['message' => 'Customer redeem points record not found'], 404);
        }

        // Check if the customer has enough redeem points
        if ($redeemPoint->redeem_points < $validated['redeem_points']) {
            return response()->json(['message' => 'Insufficient redeem points'], 400);
        }

        // Deduct the redeem points
        $redeemPoint->redeem_points -= $validated['redeem_points'];
        $redeemPoint->save();

        return response()->json([
            'message' => 'Redeem points deducted successfully',
            'remaining_points' => $redeemPoint->redeem_points
        ]);
    }

}
