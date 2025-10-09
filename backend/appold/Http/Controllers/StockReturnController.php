<?php

namespace App\Http\Controllers;

use App\Models\stockreturn;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;


class StockReturnController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $stockReturns = DB::table('stockreturn')
            ->leftJoin('stock_payment', 'stockreturn.id', '=', 'stock_payment.stock_return_id')
            ->select('stockreturn.*', 'stock_payment.amount', 'stock_payment.payment_type', 'stock_payment.payment_note')
            ->get();
    
        return response()->json($stockReturns);
    }
    

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Log the incoming request data

        // Validate the request data (Uncomment and adjust validation as necessary)
        $validated = $request->validate([
            'supplier_name' => 'required',
            'date' => 'required',
            'status' => 'nullable',
            'reference_no' => 'required',
            'amount' => 'required',
            'payment_type' => 'required',
            'payment_note' => 'nullable',
        ]);

        // Start DB transaction
        DB::beginTransaction();

        try {
            // Log beginning of DB operations

            // Insert into stockreturn table and get inserted ID
            $stockReturnId = DB::table('stockreturn')->insertGetId([
                'supplier_name' => $validated['supplier_name'],
                'date' => $validated['date'],
                'status' => $validated['status'],
                'reference_no' => $validated['reference_no'],
            ]);



            // Insert into stock_payment table with the stockReturnId
            DB::table('stock_payment')->insert([
                'amount' => $validated['amount'],
                'payment_type' => $validated['payment_type'],
                'payment_note' => $validated['payment_note'],
                'stock_return_id' => $stockReturnId,  // Assuming you need to reference the stock return ID
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // Log successful insertion into stock_payment
            // Log::info('Inserted into stock_payment table successfully.');

            // Commit the transaction
            DB::commit();

            return response()->json(['message' => 'Data stored successfully'], 201);
        } catch (\Exception $e) {
            // Log the error
            // Log::error('Error during database operation: ' . $e->getMessage());

            // Rollback the transaction
            DB::rollBack();

            return response()->json(['error' => 'Something went wrong', 'details' => $e->getMessage()], 500);
        }
    }
    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $stockReturn = stockreturn::find($id);

        if (!$stockReturn) {
            return response()->json(['message' => 'Stock Return not found'], 404);
        }

        return response()->json($stockReturn);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    { {
            $stockReturn = stockreturn::find($id);

            if (!$stockReturn) {
                return response()->json(['message' => 'Stock Return not found'], 404);
            }

            $request->validate([
                'supplier_name' => 'sometimes|required|string|max:255',
                'date' => 'sometimes|required|date',
                'status' => 'nullable|string|max:50',
                'reference_no' => 'required' . $id,
            ]);

            $stockReturn->update($request->all());

            return response()->json([
                'message' => 'Stock Return updated successfully!',
                'data' => $stockReturn
            ]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $stockReturn = stockreturn::find($id);

        if (!$stockReturn) {
            return response()->json(['message' => 'Stock Return not found'], 404);
        }

        $stockReturn->delete();

        return response()->json(['message' => 'Stock Return deleted successfully!']);
    }
}
