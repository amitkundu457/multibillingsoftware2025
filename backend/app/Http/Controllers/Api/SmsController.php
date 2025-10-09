<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Customer;
use Tymon\JWTAuth\Facades\JWTAuth;
use App\Jobs\SendBulkSmsJob;
use Illuminate\Support\Facades\Log;



class SmsController extends Controller
{
    //

    public function BulkSms(Request $request)
{
     $user = JwtAuth::parseToken()->authenticate();
    //  dd($user->id);

     $validated = $request->validate([
        'customerType_id' => 'nullable',
        'customerSubType_id' => 'nullable',
    ]);

    $customers = Customer::query()
         ->when($validated['customerType_id'] ?? null, function ($q, $typeId) {
            $q->where('customer_type', $typeId);
        })
        ->when($validated['customerSubType_id'] ?? null, function ($q, $subTypeId) {
            $q->where('customer_sub_type', $subTypeId);
        })
        ->where('created_by',$user->id)
        ->pluck('id')
        ->toArray();
            Log::info('Bulk SMS Customers: ' . json_encode($customers));


         SendBulkSmsJob::dispatch($customers);

     return response()->json([
        'success' => true,
        'message' => 'Bulk SMS job queued successfully!',
        'customers'=> $customers
     ]);
}

}
