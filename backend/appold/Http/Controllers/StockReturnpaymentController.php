<?php

namespace App\Http\Controllers;

use App\Models\StockReturnPayment;
use Illuminate\Http\Request;
use App\Models\payment_stock;

class StockReturnPaymentController extends Controller
{

    public function index()
    {

        $payments = payment_stock::all();


        return response()->json([
            'success' => true,
            'data' => $payments
        ], 200);
    }


    public function create()
    {

        return response()->json(['message' => 'Form to create payment'], 200);
    }


    public function store(Request $request)
    {

        $request->validate([
            'amount' => 'required',
            'payment_type' => 'required',
            'payment_note' => 'nullable',
        ]);

        // Create and store the new stock return payment
        $payment = payment_stock::create($request->all());


        return response()->json([
            'success' => true,
            'message' => 'Stock Return Payment created successfully!',
            'data' => $payment
        ], 201);
    }


    public function show(payment_stock $stockReturnPayment)
    {

        return response()->json([
            'success' => true,
            'data' => $stockReturnPayment
        ], 200); // HTTP Status 200
    }


    public function edit(payment_stock $stockReturnPayment)
    {
        // You can return a JSON response indicating the form to edit
        return response()->json(['message' => 'Form to edit payment', 'data' => $stockReturnPayment], 200);
    }


    public function update(Request $request, payment_stock $stockReturnPayment)
    {
        // Validate the incoming data
        $request->validate([
            'amount' => 'required|numeric',
            'payment_type' => 'required|in:Account,None',
            'payment_note' => 'nullable|string',
        ]);


        $stockReturnPayment->update($request->all());

        // Return success message as JSON
        return response()->json([
            'success' => true,
            'message' => 'Stock Return Payment updated successfully!',
            'data' => $stockReturnPayment
        ], 200); // HTTP Status 200
    }


    public function destroy(payment_stock $stockReturnPayment)
    {
        // Delete the stock return payment from the database
        $stockReturnPayment->delete();

        // Return success message as JSON
        return response()->json([
            'success' => true,
            'message' => 'Stock Return Payment deleted successfully!'
        ], 200); // HTTP Status 200
    }
}
