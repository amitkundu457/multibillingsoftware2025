<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AccountMaster;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Log;


class AccountMasterController extends Controller
{
    // public function index()
    // {
    //     $customer = JWTAuth::parseToken()->authenticate();
    // Log::info('Authenticated Customer:', ['customer' => $customer]);

    //     return response()->json(AccountMaster::all(), 200);
    // }
    public function index()
{
    $customer = JWTAuth::parseToken()->authenticate();
    Log::info('Authenticated Customer:', ['customer' => $customer]);

    $accounts = AccountMaster::where('created_by', $customer->id)->get();

    return response()->json($accounts, 200);
}


    // Get a single account master
    public function show($id)
    {
        $accountMaster = AccountMaster::find($id);

        if (!$accountMaster) {
            return response()->json(['error' => 'Account Master not found'], 404);
        }

        return response()->json($accountMaster, 200);
    }

    // Create a new account master
    // public function store(Request $request)
    // {
    //     $customer = JWTAuth::parseToken()->authenticate();
    // Log::info('Authenticated Customer:', ['customer' => $customer]);

    //     $validated = $request->validate([
    //         'account_name' => 'nullable|string|max:255',
    //         'gstin' => 'nullable|string|max:15',
    //         'phone' => 'nullable|numeric',
    //         'account_group_id' => 'nullable|integer|',
    //         'city' => 'nullable|string|max:255',
    //         'state' => 'nullable|string|max:255',
    //         'contact_person' => 'nullable|string|max:255',
    //         'blance' => 'nullable',
    //         'account_type_id'=> 'nullable|integer',
    //         'address'=> 'nullable',
    //         'status' => 'nullable|boolean',
    //     ]);

    //     $accountMaster = AccountMaster::create($validated);

    //     return response()->json($accountMaster, 201);
    // }
    public function store(Request $request)
{
    $customer = JWTAuth::parseToken()->authenticate();
    Log::info('Authenticated Customer:', ['customer' => $customer]);

    $validated = $request->validate([
        'account_name' => 'nullable|string|max:255',
        'gstin' => 'nullable|string|max:15',
        'phone' => 'nullable|numeric',
        'account_group_id' => 'nullable|integer',
        'city' => 'nullable|string|max:255',
        'state' => 'nullable|string|max:255',
        'contact_person' => 'nullable|string|max:255',
        'blance' => 'nullable',
        'account_type_id'=> 'nullable|integer',
        'address'=> 'nullable',
        'status' => 'nullable|boolean',
    ]);

    // Add created_by to the validated data
    $validated['created_by'] = $customer->id;

    $accountMaster = AccountMaster::create($validated);

    return response()->json($accountMaster, 201);
}


    // Update an existing account master
    public function update(Request $request, $id)
    {
        $accountMaster = AccountMaster::find($id);

        if (!$accountMaster) {
            return response()->json(['error' => 'Account Master not found'], 404);
        }

        $validated = $request->validate([
            'account_name' => 'sometimes|nullable|string|max:255',
            'gstin' => 'sometimes|nullable|string|max:15',
            'phone' => 'sometimes|nullable|numeric',
            'account_group_id' => 'sometimes|nullable|integer',
            'city' => 'sometimes|nullable|string|max:255',
            'state' => 'sometimes|nullable|string|max:255',
            'contact_person' => 'sometimes|nullable|string|max:255',
            'blance' => 'sometimes|nullable|integer',
            'status' => 'sometimes|nullable|boolean',
            'account_type_id'=> 'nullable|integer',
            'address'=> 'nullable',
        ]);

        $accountMaster->update($validated);

        return response()->json($accountMaster, 200);
    }

    // Delete an account master
    public function destroy($id)
    {
        $accountMaster = AccountMaster::find($id);

        if (!$accountMaster) {
            return response()->json(['error' => 'Account Master not found'], 404);
        }

        $accountMaster->delete();

        return response()->json(['message' => 'Account Master deleted successfully'], 200);
    }
}
