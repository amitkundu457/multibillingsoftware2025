<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;

use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;

use App\Models\KarigarList;
use Illuminate\Support\Facades\Validator;

class KarigarListController extends Controller
{
    
     // Fetch all KarigarLists
     public function index()
     {
        
         // Get the authenticated user from the token
    $customer = JWTAuth::parseToken()->authenticate();
    $userId = $customer->id; // Extract user ID from token

    // Filter KarigarList where 'created_By' matches the user's ID
    $karigarList = KarigarList::where('created_By', $userId)->get();

    return response()->json($karigarList, 200);
     }
 
     // Store a new KarigarList
     public function store(Request $request)
     {
        $customer = JWTAuth::parseToken()->authenticate();
         $validator = Validator::make($request->all(), [
             'name' => 'required|string|max:255',
            
         ]);
 
         if ($validator->fails()) {
             return response()->json($validator->errors(), 422);
         }
 
        // Create a new KarigarList entry
         $karigar = KarigarList::create([
        'id' => $request->id, // ID from request
        'name' => $request->name,
        'created_By' => $customer->id, // Set created_By from authenticated customer
    ]);

         return response()->json($karigar, 201);
     }
 
     // Show a single KarigarList
     public function show($id)
     {
         $karigar = KarigarList::find($id);
         if (!$karigar) {
             return response()->json(['message' => 'Karigar not found'], 404);
         }
         return response()->json($karigar, 200);
     }
 
     // Update a KarigarList
     public function update(Request $request, $id)
     {
         $karigar = KarigarList::find($id);
         if (!$karigar) {
             return response()->json(['message' => 'Karigar not found'], 404);
         }
 
         $validator = Validator::make($request->all(), [
             'name' => 'sometimes|string|max:255',
             'created_By' => 'sometimes|integer',
         ]);
 
         if ($validator->fails()) {
             return response()->json($validator->errors(), 422);
         }
 
         $karigar->update($request->all());
         return response()->json($karigar, 200);
     }
 
     // Delete a KarigarList
     public function destroy($id)
     {
         $karigar = KarigarList::find($id);
         if (!$karigar) {
             return response()->json(['message' => 'Karigar not found'], 404);
         }
         
         $karigar->delete();
         return response()->json(['message' => 'Karigar deleted successfully'], 200);
     }
}
