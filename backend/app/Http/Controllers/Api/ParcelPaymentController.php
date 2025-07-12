<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ParcelPayment;
use App\Models\ParcelOrder;
use App\Models\ParcelBill;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;


class ParcelPaymentController extends Controller
{
    //
    public function store(Request $request)
{
    $validator = Validator::make($request->all(), [
        'order_id' => 'required|exists:parcel_orders,id',
        'payments' => 'required|array|min:1',
        'payments.*.payment_mode' => 'required|string|max:100',
        'payments.*.amount' => 'required|numeric|min:0.01',
    ]);

    if ($validator->fails()) {
        return response()->json(['errors' => $validator->errors()], 422);
    }

    $order = ParcelBill::findOrFail($request->order_id);
    $grandTotal = $order->grand_total;

    // ✅ Get total amount already paid
    $alreadyPaid = ParcelPayment::where('order_id', $order->id)->sum('amount');

    // ✅ Calculate total of current request
    $newPaymentTotal = collect($request->payments)->sum('amount');

    // ✅ Prevent double payment
    if ($alreadyPaid >= $grandTotal) {
        return response()->json([
            'message' => 'Payment is already completed for this order.',
        ], 409);
    }

    // ✅ Prevent overpayment
    // if (($alreadyPaid + $newPaymentTotal) > $grandTotal) {
    //     return response()->json([
    //         'error' => 'Payment exceeds the order total.',
    //         'already_paid' => $alreadyPaid,
    //         'new_payment' => $newPaymentTotal,
    //         'grand_total' => $grandTotal,
    //     ], 422);
    // }

    // ✅ Save payments
    foreach ($request->payments as $payment) {
        ParcelPayment::create([
            'order_id' => $order->id,
            'customer_id' => $order->customer_id,
            'payment_method' => $payment['payment_mode'],
            'amount' => $payment['amount'],
            'payment_date' => now()->toDateString(),
        ]);
    }

    return response()->json([
        'message' => 'Payments recorded successfully.',
        'total_paid' => $alreadyPaid + $newPaymentTotal,
        'remaining' => $grandTotal - ($alreadyPaid + $newPaymentTotal),
    ]);
}

}
