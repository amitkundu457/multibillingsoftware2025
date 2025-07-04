<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\BISNumber;


use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Log;

class BISNumberController extends Controller
{
    //


//     public function index()
// {
//     $bis = BISNumber::first(); // since there's only one

//     return response()->json([
//         'bis_number' => $bis?->bis_number ?? '',
//     ]);
// }
public function index()
{
    $customer = JWTAuth::parseToken()->authenticate();

    $bis = BISNumber::where('created_by', $customer->id)->first(); // Assuming only one record per user

    return response()->json([
        'bis_number' => $bis?->bis_number ?? '',
    ]);
}

//     public function store(Request $request)
// {
//     $customer = JWTAuth::parseToken()->authenticate();
//     Log::info('Authenticated Customer:', ['customer' => $customer]);


//     $request->validate([
//         'bis_number' => 'required|string|',
//      ]);

//      BISNumber::truncate();

//     $bis = BISNumber::create([
//         'bis_number' => $request->bis_number,
//      ]);

//     return response()->json([
//         'message' => 'BIS number stored successfully',
//         'data' => $bis,
//     ], 201);
// }
public function store(Request $request)
{
    $customer = JWTAuth::parseToken()->authenticate();
    Log::info('Authenticated Customer:', ['customer' => $customer]);

    $request->validate([
        'bis_number' => 'required|string',
    ]);

    BISNumber::truncate();

    $bis = BISNumber::create([
        'bis_number' => $request->bis_number,
        'created_by' => $customer->id,
    ]);

    return response()->json([
        'message' => 'BIS number stored successfully',
        'data' => $bis,
    ], 201);
}

}
