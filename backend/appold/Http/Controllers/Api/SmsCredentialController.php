<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SmsCredential;
use Illuminate\Http\Request;

class SmsCredentialController extends Controller
{
    //
    public function index()
    {
        return response()->json(SmsCredential::all());
    }

    public function store(Request $request)
    {
        $request->validate([
            'business_name' => 'required|string',
            'sms_username' => 'required|string',
            'sms_password' => 'required|string',
            'sms_sender' => 'required|string',
            'sms_entity_id' => 'required|string',
        ]);

        $credential = SmsCredential::create($request->all());

        return response()->json([
            'message' => 'SMS Credential stored successfully',
            'data' => $credential
        ], 201);
    }

     public function update(Request $request, $id)
    {
        $credential = SmsCredential::findOrFail($id);

        $credential->update($request->only([
            'name', 'sms_username', 'sms_password', 'sms_sender', 'sms_entity_id'
        ]));

        return response()->json(['message' => 'Credential updated', 'data' => $credential]);
    }
    public function destroy($id)
    {
        $credential = SmsCredential::findOrFail($id);
        $credential->delete();

        return response()->json(['message' => 'Credential deleted']);
    }
}

