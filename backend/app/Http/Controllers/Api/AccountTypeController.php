<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\AccountType;


class AccountTypeController extends Controller
{
    //
    public function index()
    {
        $accountTypes = AccountType::all(); // Get all account types

        // Return a JSON response with the account types
        return response()->json($accountTypes);
    }


    // Store a new account type
    public function store(Request $request)
    {
        // Validate the incoming request
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        // Create a new account type
        $accountType = AccountType::create([
            'name' => $request->name,
        ]);

        // Return a JSON response with the created account type
        return response()->json($accountType, 201);
    }

    public function update(Request $request, $id)
    {
        // Validate the incoming request
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        // Find the account type by ID
        $accountType = AccountType::find($id);

        // If not found, return an error response
        if (!$accountType) {
            return response()->json(['message' => 'Account Type not found'], 404);
        }

        // Update the account type
        $accountType->update([
            'name' => $request->name,
        ]);

        // Return a JSON response with the updated account type
        return response()->json($accountType);
    }

    public function destroy($id)
    {
        // Find the account type by ID
        $accountType = AccountType::find($id);

        // If not found, return an error response
        if (!$accountType) {
            return response()->json(['message' => 'Account Type not found'], 404);
        }

        // Delete the account type
        $accountType->delete();

        // Return a success response
        return response()->json(['message' => 'Account Type deleted successfully']);
    }
}
