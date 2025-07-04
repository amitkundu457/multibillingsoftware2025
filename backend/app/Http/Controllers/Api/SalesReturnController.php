<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\salesreturn;
use App\Models\salesreturnPayment;
use App\Models\SaloonPurchaseReturn;
use App\Models\SaloonPurchaseReturnPayment;
use App\Models\ProductService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Log;

class SalesReturnController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    // public function index()
    // {
    //     $customer = JWTAuth::parseToken()->authenticate();
    // Log::info('Authenticated Customer:', ['customer' => $customer]);
    //     $salesreturns = DB::table('salesreturns')
    //         ->leftJoin('salesreturn_payments', 'salesreturns.id', '=', 'salesreturn_payments.sales_return_id')
    //         ->select('salesreturns.*', 'salesreturn_payments.amount', 'salesreturn_payments.payment_type', 'salesreturn_payments.payment_note')
    //         ->get();

    //     return response()->json($salesreturns);
    // }
    public function index()
{
    $customer = JWTAuth::parseToken()->authenticate();
    Log::info('Authenticated Customer:', ['customer' => $customer]);

    $salesreturns = DB::table('salesreturns')
        ->leftJoin('salesreturn_payments', 'salesreturns.id', '=', 'salesreturn_payments.sales_return_id')
        ->select(
            'salesreturns.*',
            'salesreturn_payments.amount',
            'salesreturn_payments.payment_type',
            'salesreturn_payments.payment_note'
        )
        ->where('salesreturns.created_by', $customer->id) // ✅ Filter by authenticated user
        ->get();

    return response()->json($salesreturns);
}
//saloon selas returns index
public function saloonSalesReturnIndex(){
    $customer=JWTAuth::parseToken()->authenticate();
    Log::info('authenticeted Cutomer',['customer'=>$customer]);
    $salesreturns=SalesReturn::with('product','saleReturnPayments')
        ->where('created_by',$customer->id)
        ->orderBy('created_at','desc')
        ->get();

        return response()->json($salesreturns);
}


//purchase return index saloon 
public function saloonPurchaseReturnIndex(){
    $customer=JWTAuth::parseToken()->authenticate();
    Log::info('authenticeted Cutomer',['customer'=>$customer]);
    $salesreturns=SaloonPurchaseReturn::with('product','saloonPurchaseReturnPayments')
        ->where('created_by',$customer->id)
        ->orderBy('created_at','desc')
        ->get();

        return response()->json($salesreturns);
}

public function saloonPurchaseIndex(){
    $customer=JWTAuth::parseToken()->authenticate();
    Log::info('authenticeted Cutomer',['customer'=>$customer]);
    $salesreturns=SaloonPurchaseReturn::with('product')
        ->where('created_by',$customer->id)
        ->orderBy('created_at','desc')
        ->get();

        return response()->json($salesreturns);
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
    //     $customer = JWTAuth::parseToken()->authenticate();
    //     Log::info('Authenticated Customer:', ['customer' => $customer]);
    //     // Get all the request data
    //     $data = $request->all();

    //     try {
    //         // Insert into salesreturns table and get the inserted ID
    //         $purchasereturnId = DB::table('salesreturns')->insertGetId([
    //             'customer_name' => $data['customer_name'],
    //             'date' => $data['date'],
    //             'status' => $data['status'] ?? null, // Optional status
    //             'reference_no' => $data['reference_no'],
    //             'reason' => $data['reason'],
    //         ]);

    //         // Insert into salesreturn_payments table with the purchasereturnId
    //         DB::table('salesreturn_payments')->insert([
    //             'amount' => $data['amount'],
    //             'payment_type' => $data['payment_type'],
    //             'payment_note' => $data['payment_note'] ?? null, // Optional payment_note
    //             'sales_return_id' => $purchasereturnId, // Linking to salesreturns table
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
        // Insert into salesreturns table and get the inserted ID
        $salesReturnId = DB::table('salesreturns')->insertGetId([
            'customer_name' => $data['customer_name'],
            'date' => $data['date'],
            'status' => $data['status'] ?? null,
            'reference_no' => $data['reference_no'],
            'reason' => $data['reason'],
            'created_by' => $customer->id, // ✅ Added this line
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Insert into salesreturn_payments table
        DB::table('salesreturn_payments')->insert([
            'amount' => $data['amount'],
            'payment_type' => $data['payment_type'],
            'payment_note' => $data['payment_note'] ?? null,
            'sales_return_id' => $salesReturnId,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json(['message' => 'Data stored successfully'], 201);

    } catch (\Exception $e) {
        return response()->json(['error' => 'Something went wrong', 'details' => $e->getMessage()], 500);
    }
}

//purchase return store end
public function SaloonPurchaseReturnstores(Request $request)
{
    try {
        $customer = JWTAuth::parseToken()->authenticate();
        Log::info('Authenticated Customer:', ['customer' => $customer]);

        $data = $request->all();

        \DB::beginTransaction();

        // Create SalesReturn
        $salesReturn = SaloonPurchaseReturn::create([
            'customer_name' => $data['customer_name'] ?? null,
            'date' => $data['date'] ?? null,
            'status' => $data['status'] ?? null,
            'reference_no' => $data['reference_no'] ?? null,
            'reason' => $data['reason'] ?? null,
            'created_by' => $customer->id,
            'quantity' => isset($data['quantity']) ? (int)$data['quantity'] : 1,
            'product_service_id' => $data['product_service_id'] ?? null,
        ]);

        // Create SalesReturnPayment
        SaloonPurchaseReturnPayment::create([
            'amount' => isset($data['amount']) ? (float)$data['amount'] : 0,
            'payment_type' => $data['payment_type'] ?? null,
            'payment_note' => $data['payment_note'] ?? null,
            'purchase_return_id' => $salesReturn->id,
        ]);

        // Subtract quantity from ProductService current_stock
        if (!empty($data['product_service_id'])) {
            $product = ProductService::where('id', $data['product_service_id'])
                ->where('created_by', $customer->id)
                ->first();

            if ($product) {
                $product->current_stock -= (int)($data['quantity'] ?? 1);
                
                $product->save();
            }
        }

        \DB::commit();

        return response()->json(['message' => 'Data stored successfully'], 201);

    } catch (\Exception $e) {
        \DB::rollBack();
        Log::error('Error storing sales return:', ['exception' => $e]);
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
        $salesreturn = salesreturn::find($id);

        if (!$salesreturn) {
            return response()->json(['message' => 'Stock Return not found'], 404);
        }

        return response()->json($salesreturn);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $salesreturn = salesreturn::find($id);

        if (!$salesreturn) {
            return response()->json(['message' => 'Stock Return not found'], 404);
        }

        $request->validate([
            'customer_name' => 'sometimes|required|string|max:255',
            'date' => 'sometimes|required|date',
            'status' => 'nullable|string|max:50',
            'reference_no' => 'required|unique:salesreturns,reference_no,' . $id,  // Update the uniqueness rule
        ]);

        $salesreturn->update($request->all());

        return response()->json([
            'message' => 'Stock Return updated successfully!',
            'data' => $salesreturn
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $salesreturn = salesreturn::find($id);

        if (!$salesreturn) {
            return response()->json(['message' => 'Stock Return not found'], 404);
        }

        $salesreturn->delete();

        return response()->json(['message' => 'Stock Return deleted successfully!']);
    }


    //saloon stock return bewlow
    
    // public function Saloonstores(Request $request)
    // {
    //     try {
    //         $customer = JWTAuth::parseToken()->authenticate();
    //         Log::info('Authenticated Customer:', ['customer' => $customer]);
    
    //         $data = $request->all();
    
    //         // Start a transaction
    //         \DB::beginTransaction();
    
    //         // Create SalesReturn
    //         $salesReturn = SalesReturn::create([
    //             'customer_name' => $data['customer_name'] ?? null,
    //             'date' => $data['date'] ?? null,
    //             'status' => $data['status'] ?? null,
    //             'reference_no' => $data['reference_no'] ?? null,
    //             'reason' => $data['reason'] ?? null,
    //             'created_by' => $customer->id,
    //             'quantity' => isset($data['quantity']) ? (int)$data['quantity'] : 1,
    //             'product_service_id' => $data['product_service_id'] ?? null,
    //         ]);
    
    //         // Create SalesReturnPayment
    //         SalesReturnPayment::create([
    //             'amount' => isset($data['amount']) ? (float)$data['amount'] : 0,
    //             'payment_type' => $data['payment_type'] ?? null,
    //             'payment_note' => $data['payment_note'] ?? null,
    //             'sales_return_id' => $salesReturn->id,
    //         ]);
    
    //         // Commit the transaction
    //         \DB::commit();
    
    //         return response()->json(['message' => 'Data stored successfully'], 201);
    
    //     } catch (\Exception $e) {
    //         \DB::rollBack();
    //         Log::error('Error storing sales return:', ['exception' => $e]);
    //         return response()->json([
    //             'error' => 'Something went wrong',
    //             'details' => $e->getMessage()
    //         ], 500);
    //     }
    // }
    

    public function Saloonstores(Request $request)
{
    try {
        $customer = JWTAuth::parseToken()->authenticate();
        Log::info('Authenticated Customer:', ['customer' => $customer]);

        $data = $request->all();

        \DB::beginTransaction();

        // Create SalesReturn
        $salesReturn = SalesReturn::create([
            'customer_name' => $data['customer_name'] ?? null,
            'date' => $data['date'] ?? null,
            'status' => $data['status'] ?? null,
            'reference_no' => $data['reference_no'] ?? null,
            'reason' => $data['reason'] ?? null,
            'created_by' => $customer->id,
            'quantity' => isset($data['quantity']) ? (int)$data['quantity'] : 1,
            'product_service_id' => $data['product_service_id'] ?? null,
        ]);

        // Create SalesReturnPayment
        SalesReturnPayment::create([
            'amount' => isset($data['amount']) ? (float)$data['amount'] : 0,
            'payment_type' => $data['payment_type'] ?? null,
            'payment_note' => $data['payment_note'] ?? null,
            'sales_return_id' => $salesReturn->id,
        ]);

        // Subtract quantity from ProductService current_stock
        if (!empty($data['product_service_id'])) {
            $product = ProductService::where('id', $data['product_service_id'])
                ->where('created_by', $customer->id)
                ->first();

            if ($product) {
                $product->current_stock += (int)($data['quantity'] ?? 1);
                
                $product->save();
            }
        }

        \DB::commit();

        return response()->json(['message' => 'Data stored successfully'], 201);

    } catch (\Exception $e) {
        \DB::rollBack();
        Log::error('Error storing sales return:', ['exception' => $e]);
        return response()->json([
            'error' => 'Something went wrong',
            'details' => $e->getMessage()
        ], 500);
    }
}



}
