<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\formOtp;
use Illuminate\Http\Request;

class formOtpController extends Controller
{
    public function storeEmail(Request $request)
    {
        $data = formOtp::create($request->all());
        // dd($data);
        // $data->generateOTP();


        // You can store the email in the database or perform other actions
        // Example: Store in a table (e.g., emails)
        // Email::create(['email' => $validated['email']]);

        return response()->json(['message' => 'Email stored successfully!']);
    }
}
