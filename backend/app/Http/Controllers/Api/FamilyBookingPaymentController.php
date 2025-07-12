<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
 use App\Models\FamilyBookingPayment;
use App\Models\FamilyBooking;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Tymon\JWTAuth\Facades\JWTAuth;

class FamilyBookingPaymentController extends Controller
{
    //

       public function store(Request $request)
{
    $validator = Validator::make($request->all(), [
        'family_booking_id' => 'required',
        'payments' => 'required|array|min:1',
        'payments.*.payment_method' => 'required|string',
        'payments.*.amount' => 'required|numeric|min:0.01',
    ]);

    if ($validator->fails()) {
        return response()->json(['errors' => $validator->errors()], 422);
    }

    $user = JWTAuth::parseToken()->authenticate();

    $familyBookingId = $request->family_booking_id;

    // Fetch the bill
    // $kotBill = \App\Models\KotBill::where('family_booking_id', $familyBookingId)->first();

    // if (!$kotBill) {
    //     return response()->json(['error' => 'Bill not generated yet.'], 400);
    // }

    // $grandTotal = $kotBill->grand_total;

    // Get total already paid
    $alreadyPaid = \App\Models\FamilyBookingPayment::where('family_booking_id', $familyBookingId)->sum('amount');

    // Sum of new payments
    // $newPaymentTotal = collect($request->payments)->sum('amount');

    // // If already fully paid
    // if ($alreadyPaid >= $grandTotal) {
    //     return response()->json(['message' => 'Payment already completed.'], 409);
    // }

    // Prevent overpayment
    // if (($alreadyPaid + $newPaymentTotal) > $grandTotal) {
    //     return response()->json([
    //         'error' => 'Payment exceeds the bill amount.',
    //         'already_paid' => $alreadyPaid,
    //         'new_payment' => $newPaymentTotal,
    //         'grand_total' => $grandTotal
    //     ], 422);
    // }

    DB::beginTransaction();

    try {
        foreach ($request->payments as $payment) {
            FamilyBookingPayment::create([
                'family_booking_id' => $familyBookingId,
                'payment_method'    => $payment['payment_method'],
                'amount'            => $payment['amount'],
                'payment_date'      => now(),
                'created_by'        => $user->id,
            ]);
        }

        DB::commit();

        return response()->json([
            'message' => 'Payments stored successfully.',
            //'total_paid' => $alreadyPaid + $newPaymentTotal,
           // 'remaining' => $grandTotal - ($alreadyPaid + $newPaymentTotal),
        ]);
    } catch (\Exception $e) {
        DB::rollBack();
        return response()->json([
            'error' => 'Something went wrong.',
            'details' => $e->getMessage()
        ], 500);
    }
}

}
