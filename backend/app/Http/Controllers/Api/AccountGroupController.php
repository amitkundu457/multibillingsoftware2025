<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AccountGroup;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Log;



class AccountGroupController extends Controller
{
//     public function index()
//     {
        
// $customer = JWTAuth::parseToken()->authenticate();
// Log::info('Authenticated Customer:', ['customer' => $customer]);

//         $accountGroups = AccountGroup::all();
//         return response()->json($accountGroups);
//     }

public function index()
{
    $customer = JWTAuth::parseToken()->authenticate();
    Log::info('Authenticated Customer:', ['customer' => $customer]);

    $accountGroups = AccountGroup::where('created_by', $customer->id)->get();

    return response()->json($accountGroups);
}

    // Create a new account group
    // public function store(Request $request)
    // {
    //     $validatedData = $request->validate([
    //         'name' => 'required|string|max:255',
    //     ]);

    //     $accountGroup = AccountGroup::create($validatedData);
    //     return response()->json($accountGroup, 201);
    // }

    public function store(Request $request)
{
    $customer = JWTAuth::parseToken()->authenticate();
    Log::info('Authenticated Customer:', ['customer' => $customer]);

    $validatedData = $request->validate([
        'name' => 'required|string|max:255',
    ]);

    $validatedData['created_by'] = $customer->id;

    $accountGroup = AccountGroup::create($validatedData);

    return response()->json($accountGroup, 201);
}


    // Display a specific account group
    public function show($id)
    {
        $accountGroup = AccountGroup::find($id);

        if (!$accountGroup) {
            return response()->json(['error' => 'Account Group not found'], 404);
        }

        return response()->json($accountGroup);
    }

    // Update an account group
    public function update(Request $request, $id)
    {
        $accountGroup = AccountGroup::find($id);

        if (!$accountGroup) {
            return response()->json(['error' => 'Account Group not found'], 404);
        }

        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $accountGroup->update($validatedData);
        return response()->json($accountGroup);
    }

    // Delete an account group
    public function destroy($id)
    {
        $accountGroup = AccountGroup::find($id);

        if (!$accountGroup) {
            return response()->json(['error' => 'Account Group not found'], 404);
        }

        $accountGroup->delete();
        return response()->json(['message' => 'Account Group deleted successfully']);
    }
}
