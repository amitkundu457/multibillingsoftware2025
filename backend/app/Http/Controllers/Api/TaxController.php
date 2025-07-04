<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Tax;
use App\Models\TaxType;
use Illuminate\Http\Request;

use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Log;







class TaxController extends Controller
{


    // fetch
//     public function index(Request $request, $id = null)
// {
//     $customer = JWTAuth::parseToken()->authenticate();
//     Log::info('Authenticated Customer:', ['customer' => $customer]);
//     if ($id) {
//         // Fetch a specific tax by ID
//         $tax = Tax::find($id);

//         if (!$tax) {
//             return response()->json(['message' => 'Tax not found'], 404);
//         }

//         return response()->json(['data' => $tax]);
//     } else {
//         // Fetch all taxes
//         $taxes = Tax::all();

//         return response()->json(['data' => $taxes]);
//     }
// }

public function index(Request $request, $id = null)
{
    $customer = JWTAuth::parseToken()->authenticate();
    Log::info('Authenticated Customer:', ['customer' => $customer]);

    if ($id) {
        // Fetch a specific tax by ID and created_by
        $tax = Tax::where('id', $id)
                  ->where('created_by', $customer->id)
                  ->first();

        if (!$tax) {
            return response()->json(['message' => 'Tax not found'], 404);
        }

        return response()->json(['data' => $tax]);
    } else {
        // Fetch all taxes created by the authenticated user
        $taxes = Tax::where('created_by', $customer->id)->get();

        return response()->json(['data' => $taxes]);
    }
}


    //  store tax
//     public function store(Request $request)
// {
//     $validated = $request->validate([
//         'name' => 'required|string|max:255',
//         'amount' => 'required|numeric|min:0',
//         'fixed_amount' => 'required|numeric|min:0',


//     ]);

//     $tax = Tax::create([
//         'name' => $validated['name'],
//         'amount' => $validated['amount'],
//         'fixed_amount'=> $validated['fixed_amount'],
//     ]);

//     return response()->json(['message' => 'Tax saved successfully', 'data' => $tax]);
// }

public function store(Request $request)
{
    // Authenticate the user via token
    $customer = JWTAuth::parseToken()->authenticate();

    // Validate input
    $validated = $request->validate([
        'name' => 'nullable|string|max:255',
        'amount' => 'required|numeric|min:0',
        'fixed_amount' => 'required|numeric|min:0',
    ]);

    // Create tax with created_by
    $tax = Tax::create([
        'name' => $validated['name'] ?? null,
        'amount' => $validated['amount'],
        'fixed_amount' => $validated['fixed_amount'],
        'created_by' => $customer->id,
    ]);

    return response()->json([
        'message' => 'Tax saved successfully',
        'data' => $tax,
    ]);
}


// update tax
public function update(Request $request, $id)
{
    $validated = $request->validate([
        'name' => 'nullable|string|max:255',
        'amount' => 'required|numeric|min:0',
        'fixed_amount' => 'required|numeric|min:0',
    ]);

    $tax = Tax::find($id);

    if (!$tax) {
        return response()->json(['message' => 'Tax not found'], 404);
    }

    // Update the tax details
    $tax->name = $validated['name'] ?? null;
    $tax->amount = $validated['amount'];
    $tax->fixed_amount= $validated['fixed_amount'];
    $tax->save();

    return response()->json(['message' => 'Tax updated successfully', 'data' => $tax]);
}


// delete tax

public function delete($id)
{
    $tax = Tax::find($id);

    if (!$tax) {
        return response()->json(['message' => 'Tax not found'], 404);
    }

    $tax->delete();

    return response()->json(['message' => 'Tax deleted successfully']);
}


public function TaxType(){
    return TaxType::all();
}


}
