<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Supplier;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;


use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Log;


class SupplierController extends Controller
{

//     public function index (){
        
// $customer = JWTAuth::parseToken()->authenticate();
// Log::info('Authenticated Customer:', ['customer' => $customer]);
//         $suppliers = Supplier::all();
//         return response()->json([
//             'message' => 'Suppliers retrieved successfully.',
//             'suppliers' => $suppliers,
//         ], 200);


//     }

public function index()
{
    $customer = JWTAuth::parseToken()->authenticate();
    Log::info('Authenticated Customer:', ['customer' => $customer]);

    $suppliers = Supplier::where('created_by', $customer->id)->get();

    return response()->json([
        'message' => 'Suppliers retrieved successfully.',
        'suppliers' => $suppliers,
    ], 200);
}


    //store

//     public function store(Request $request)
// {
//     $validator = Validator::make($request->all(), [

//         'name' => 'required|string|max:255',
//         'phone_number' => 'required|string|max:15',
//         'address' => 'required|string|max:255',
//         'state' => 'required|string|max:255',
//         'city' => 'required|string|max:255',
//         'pincode' => 'required|string|max:6',
//     ]);

//     if ($validator->fails()) {
//         return response()->json(['errors' => $validator->errors()], 422);
//     }

//     $supplier = Supplier::create($validator->validated());

//     return response()->json([
//         'message' => 'Supplier created successfully.',
//         'supplier' => $supplier,
//     ], 201);
// }


public function store(Request $request)
{
    $customer = JWTAuth::parseToken()->authenticate();
    Log::info('Authenticated Customer:', ['customer' => $customer]);

    $validator = Validator::make($request->all(), [
        'name' => 'required|string|max:255',
        'phone_number' => 'required|string|max:15',
        'address' => 'required|string|max:255',
        'state' => 'required|string|max:255',
        'city' => 'required|string|max:255',
        'pincode' => 'required|string|max:6',
    ]);

    if ($validator->fails()) {
        return response()->json(['errors' => $validator->errors()], 422);
    }

    $validatedData = $validator->validated();
    $validatedData['created_by'] = $customer->id;

    $supplier = Supplier::create($validatedData);

    return response()->json([
        'message' => 'Supplier created successfully.',
        'supplier' => $supplier,
    ], 201);
}



    // Edit Supplier
    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'phone_number' => 'required|string|max:15',
            'address' => 'required|string|max:255',
            'state' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'pincode' => 'required|string|max:6',
        ]);

        $supplier = Supplier::find($id);

        if (!$supplier) {
            return response()->json([
                'message' => 'Supplier not found.',
            ], 404);
        }

        $supplier->update($request->all());

        return response()->json([
            'message' => 'Supplier updated successfully.',
            'supplier' => $supplier,
        ]);
    }

    // Delete Supplier
    public function destroy($id)
    {
        $supplier = Supplier::find($id);

        if (!$supplier) {
            return response()->json([
                'message' => 'Supplier not found.',
            ], 404);
        }

        $supplier->delete();

        return response()->json([
            'message' => 'Supplier deleted successfully.',
        ]);
    }
}
