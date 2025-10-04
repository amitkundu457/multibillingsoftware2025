<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PurchaseReturn;
use App\Models\PurchaseReturnPayment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Log;



class PurchaseReturnController extends Controller
{
    /**
     * Display a listing of the resource.
     */
//     public function index()
//     {
        
// $customer = JWTAuth::parseToken()->authenticate();
// Log::info('Authenticated Customer:', ['customer' => $customer]);


//         $purchasereturns = DB::table('purchasereturns')
//             ->leftJoin('purchasereturn_payments', 'purchasereturns.id', '=', 'purchasereturn_payments.purchase_return_id')
//             ->select('purchasereturns.*', 'purchasereturn_payments.amount', 'purchasereturn_payments.payment_type', 'purchasereturn_payments.payment_note')
//             ->get();

//         return response()->json($purchasereturns);
//     }

public function index()
{
    $customer = JWTAuth::parseToken()->authenticate();
    Log::info('Authenticated Customer:', ['customer' => $customer]);

    $purchasereturns = DB::table('purchasereturns')
        ->leftJoin('purchasereturn_payments', 'purchasereturns.id', '=', 'purchasereturn_payments.purchase_return_id')
        ->select(
            'purchasereturns.*',
            'purchasereturn_payments.amount',
            'purchasereturn_payments.payment_type',
            'purchasereturn_payments.payment_note'
        )
        ->where('purchasereturns.created_by', $customer->id) // ✅ Filter by created_by
        ->get();

    return response()->json($purchasereturns);
}

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // Not used for API resources usually
    }

    /**
     * Store a newly created resource in storage.
     */
    // public function stores(Request $request)
    // {
        

    //     // $customer = JWTAuth::parseToken()->authenticate();

    //     // Get all the request data
    //     $data = $request->all();

    //     try {
    //         // Insert into purchasereturns table and get the inserted ID
    //         $purchasereturnId = DB::table('purchasereturns')->insertGetId([
    //             'supplier_name' => $data['supplier_name'],
    //             'date' => $data['date'],
    //             'status' => $data['status'] ?? null, // Optional status
    //             'reference_no' => $data['reference_no'],
    //             'reasons' => $data['reasons'],
    //             // 'created_by' =>  $customer->id,
    //         ]);

    //         // Insert into purchasereturn_payments table with the purchasereturnId
    //         DB::table('purchasereturn_payments')->insert([
    //             'amount' => $data['amount'],
    //             'payment_type' => $data['payment_type'],
    //             'payment_note' => $data['payment_note'] ?? null, // Optional payment_note
    //             'purchase_return_id' => $purchasereturnId, // Linking to purchasereturns table
    //             'created_at' => now(),
    //             'updated_at' => now(),
    //         ]);

    //         // Return success response
    //         return response()->json(['message' => 'Data stored successfully'], 201);
    //     } catch (\Exception $e) {
    //         // Return error response in case of failure
    //         return response()->json(['error' => 'Something went wrong', 'details' => $e->getMessage()], 500);
    //     }
    // }

    public function stores(Request $request)
{
    $customer = JWTAuth::parseToken()->authenticate();
    Log::info('Authenticated Customer:', ['customer' => $customer]);

    $data = $request->all();

    try {
        // Insert into purchasereturns table and get the inserted ID
        $purchasereturnId = DB::table('purchasereturns')->insertGetId([
            'supplier_name' => $data['supplier_name'],
            'date' => $data['date'],
            'status' => $data['status'] ?? null,
            'reference_no' => $data['reference_no'],
            'reasons' => $data['reasons'],
            'created_by' => $customer->id, // ✅ Added
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Insert into purchasereturn_payments table
        DB::table('purchasereturn_payments')->insert([
            'amount' => $data['amount'],
            'payment_type' => $data['payment_type'],
            'payment_note' => $data['payment_note'] ?? null,
            'purchase_return_id' => $purchasereturnId,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json(['message' => 'Data stored successfully'], 201);
    } catch (\Exception $e) {
        return response()->json([
            'error' => 'Something went wrong',
            'details' => $e->getMessage()
        ], 500);
    }
}




    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $purchasereturn = PurchaseReturn::find($id);

        if (!$purchasereturn) {
            return response()->json(['message' => 'Stock Return not found'], 404);
        }

        return response()->json($purchasereturn);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $purchasereturn = PurchaseReturn::find($id);

        if (!$purchasereturn) {
            return response()->json(['message' => 'Stock Return not found'], 404);
        }

        $request->validate([
            'supplier_name' => 'sometimes|required|string|max:255',
            'date' => 'sometimes|required|date',
            'status' => 'nullable|string|max:50',
            'reference_no' => 'required|unique:purchasereturns,reference_no,' . $id,  // Update the uniqueness rule
        ]);

        $purchasereturn->update($request->all());

        return response()->json([
            'message' => 'Stock Return updated successfully!',
            'data' => $purchasereturn
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $purchasereturn = PurchaseReturn::find($id);

        if (!$purchasereturn) {
            return response()->json(['message' => 'Stock Return not found'], 404);
        }

        $purchasereturn->delete();

        return response()->json(['message' => 'Stock Return deleted successfully!']);
    }
}
