<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Models\SmsCredential;
use Tymon\JWTAuth\Facades\JWTAuth;
use App\Http\Controllers\Controller;
use Tymon\JWTAuth\Contracts\Providers\Auth;

class SmsCredentialController extends Controller
{
    //
    // public function index()
    // {
    //     return response()->json(SmsCredential::all());
    // }
    public function index()
    {
        $user = JWTAuth::parseToken()->authenticate();

        $credentials = SmsCredential::where('created_by', $user->id)->get();

        return response()->json($credentials);
    }
    // public function store(Request $request)
    // {
    //     $customer = JWTAuth::parseToken()->authenticate();

    //     $request->validate([
    //         'business_name' => 'required|string',
    //         'sms_username' => 'required|string',
    //         'sms_password' => 'required|string',
    //         'sms_sender' => 'required|string',
    //         'sms_entity_id' => 'required|string',
    //         "created_by"=>"required"
    //     ]);

    //     $credential = SmsCredential::create($request->all());

    //     return response()->json([
    //         'message' => 'SMS Credential stored successfully',
    //         'data' => $credential
    //     ], 201);
    // }

    public function store(Request $request)
{
    $customer = JWTAuth::parseToken()->authenticate();

    $request->validate([
        'business_name' => 'required|string',
        'sms_username' => 'required|string',
        'sms_password' => 'required|string',
        'sms_sender' => 'required|string',
        'sms_entity_id' => 'required|string',
        // 'created_by' => 'required|integer'
    ]);

    // ✅ Option 1: Directly create including created_by
    $credential = SmsCredential::create([
        'business_name' => $request->business_name,
        'sms_username' => $request->sms_username,
        'sms_password' => $request->sms_password,
        'sms_sender' => $request->sms_sender,
        'sms_entity_id' => $request->sms_entity_id,
        'created_by' => $customer->id, // 👈 added here
    ]);

    return response()->json([
        'message' => 'SMS Credential stored successfully',
        'data' => $credential
    ], 201);
}
    //  public function update(Request $request, $id)
    // {
    //     $customer = JWTAuth::parseToken()->authenticate();
    //     $credential = SmsCredential::findOrFail($id);

    //     $credential->update($request->only([
    //         'name', 'sms_username', 'sms_password', 'sms_sender', 'sms_entity_id'
    //     ]));

    //     return response()->json(['message' => 'Credential updated', 'data' => $credential]);
    // }

    public function update(Request $request, $id)
{
    $user = JWTAuth::parseToken()->authenticate();
    $credential = SmsCredential::findOrFail($id);

    $credential->update([
        'name'           => $request->name,
        'sms_username'   => $request->sms_username,
        'sms_password'   => $request->sms_password,
        'sms_sender'     => $request->sms_sender,
        'sms_entity_id'  => $request->sms_entity_id,
        'created_by'     => $user->id, // 👈 overwrite created_by
    ]);

    return response()->json([
        'message' => 'Credential updated successfully',
        'data'    => $credential,
    ]);
}
    public function destroy($id)
    {
        $credential = SmsCredential::findOrFail($id);
        $credential->delete();

        return response()->json(['message' => 'Credential deleted']);
    }
}

