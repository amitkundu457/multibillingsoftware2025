<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\loyalty;
use Illuminate\Http\Request;

class LoyaltyController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()

    {
        //
        $loyalty = loyalty::all();
        return response()->json($loyalty);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        //

    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
{
    // Validate the incoming data
    $data = $request->validate([
        'loyalty_balance' => '|integer',
        'min_loyalty_required' => '|integer',
        'min_invoice_bill_to_get_point' => '|numeric',
        'max_loyalty_redeemable' => '|integer',
        'set_loyalty_points'=> '|integer',
        'expiry' => '|date',
    ]);

    // Create a new loyalty record
    $loyalty = loyalty::create($data);

    // Return a successful response with the created loyalty record
    return response()->json($loyalty, 201);
}


    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
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
    public function update(Request $request,  $id)
    {
        //
        $loyalty = loyalty::findOrFail($id);

        $data = $request->validate([
            'loyalty_balance' => 'integer',
            'min_loyalty_required' => 'integer',
            'min_invoice_bill_to_get_point' => 'numeric',
            'max_loyalty_redeemable' => 'integer',
            'set_loyalty_points'=> '|integer',

            'expiry' => 'date'
        ]);

        $loyalty->update($data);
        return response()->json($loyalty);

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
        $loyalty = loyalty::findOrFail($id);
        $loyalty->delete();
        return response()->json(['message' => 'Deleted successfully']);



    }
}
