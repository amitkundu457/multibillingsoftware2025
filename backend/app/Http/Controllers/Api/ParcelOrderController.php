<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ParcelOrder;
use App\Models\User;
use App\Models\Customer;

use App\Models\ParcelOrderItem;

use App\Models\ParcelBill;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Log;


use Illuminate\Http\Request;

class ParcelOrderController extends Controller
{
    //
    public function storeParcelOrder(Request $request)
{
      $customer = JWTAuth::parseToken()->authenticate();

    $request->validate([
        'customer_id' => 'nullable|',
        'items' => 'required|array|min:1',
        'items.*.product_id' => 'required|exists:product_services,id',
        'items.*.quantity' => 'required|integer|min:1',
        'items.*.product_price' => 'required|numeric|min:0',
        'items.*.tax_rate' => 'required|numeric|min:0',
    ]);

    $order = ParcelOrder::create([
        'customer_id' => $request->customer_id,
          'created_by' => $customer->id,

        'status' => 'pending',
    ]);

    foreach ($request->items as $item) {
        ParcelOrderItem::create([
            'parcel_order_id' => $order->id,
            'product_id' => $item['product_id'],
            'quantity' => $item['quantity'],
            'product_price' => $item['product_price'],
            'tax_rate'=>$item['tax_rate'],
            'kot_generated' => true,
        ]);
    }

    return response()->json([
        'message' => 'Parcel order created successfully',
        'parcel_order_id' => $order->id,
    ]);
}


public function getParcelKOT($parcel_order_id)
{
    $order = ParcelOrder::with(['items.product', 'customer'])->find($parcel_order_id);

    if (!$order) {
        return response()->json(['message' => 'Parcel order not found'], 404);
    }

     $user = null;
    if ($order->customer && $order->customer->user_id) {
        $user =User::find($order->customer->user_id);
    }

   return response()->json([
    'order_id' => $order->id,
    'token' => $order->token,  // <- Just the integer token
    'customer' => $order->customer ?? 'Guest',
        'user' => $user ?? 'Guest',

    'date' => $order->created_at->format('Y-m-d H:i'),
    'items' => $order->items->map(function ($item) {
        return [
            'product_name' => $item->product->name,
            'quantity' => $item->quantity,
            'tax_rate'=>$item->tax_rate
        ];
    }),
]);


}


public function generateBill($orderId)
{
          $customer = JWTAuth::parseToken()->authenticate();

    $order = ParcelOrder::with('items.product', 'customer','createdBy')->findOrFail($orderId);
    Log::info($order);
    // if ($order->bill) {
    //     return response()->json(['message' => 'Bill already generated for this order.'], 409);
    // }

    // $subtotal = $order->items->sum(function ($item) {
    //     return $item->quantity * $item->product_price;
    // });

    $billItems = [];
$subtotal = 0;
$totalGst = 0;

foreach ($order->items as $item) {
    $total = $item->quantity * $item->product_price;
    $gst = ($total * $item->tax_rate) / 100;

    $billItems[] = [
        'product_id'    => $item->product_id,
        'product_name'  => $item->product?->name,
        'product_price' => $item->product_price,
        'quantity'      => $item->quantity,
        'total'         => round($total, 2),
        'tax_rate'      => $item->tax_rate,
        'gst'           => round($gst, 2),
    ];

    $subtotal += $total;
    $totalGst += $gst;
}


     $user = null;
    if ($order->customer && $order->customer->user_id) {
        $user = \App\Models\User::find($order->customer->user_id);
    }

    $gst =$totalGst;
    $grandTotal = $subtotal + $totalGst;


    $bill = ParcelBill::create([
        'parcel_order_id' => $order->id,
        'subtotal' => $subtotal,
        'gst' => $gst,
       'created_by' => $customer->id,

        'grand_total' => $grandTotal,
    ]);

    return response()->json([
        'message' => 'Bill generated',
        'bill' => $bill,
        'customer' => $order->customer,
          'user' => $user ?? 'Guest',
          'created_by' => $order->createdBy ? [
    'id' => $order->createdBy->id,
    'name' => $order->createdBy->name,
    'email' => $order->createdBy->email,
    'status' => $order->createdBy->status,
    'last_login_at' => $order->createdBy->last_login_at,
    'last_order_at' => $order->createdBy->last_order_at,
] : null,


        'items' => $order->items->map(function ($item) {
            return [
                'product_name' => $item->product->name,
                'quantity' => $item->quantity,
                'tax_rate'=>$item->tax_rate,
                'total' => $item->quantity * $item->product_price,
            ];
        }),
    ]);
}

//parcel repost 

public function ParcelKOTReport()
{
    $customer = JWTAuth::parseToken()->authenticate();

    // Fetch multiple orders
    $orders = ParcelOrder::with(['items.product', 'customer'])
        ->where('created_by', $customer->id)
        ->orderBy('created_at', 'desc')
        ->get();

    if ($orders->isEmpty()) {
        return response()->json(['message' => 'Parcel order not found'], 404);
    }

    // Format each order
    $data = $orders->map(function ($order) {
        $user = null;
        if ($order->customer && $order->customer->user_id) {
            $user = User::find($order->customer->user_id);
        }

        return [
            'order_id' => $order->id,
            'order_date'=>$order->created_at,
            'token' => $order->token,
            'customer' => $order->customer ?? 'Guest',
            'user' => $user ?? 'Guest',
            'date' => $order->created_at->format('Y-m-d H:i'),
            'items' => $order->items->map(function ($item) {
                return [
                    'product_name' => $item->product->name ?? '',
                    'quantity' => $item->quantity,
                    'tax_rate' => $item->tax_rate,
                ];
            }),
        ];
    });

    return response()->json($data);
}


//generate parcel bill 
public function generateBillReport()
{
    $customer = JWTAuth::parseToken()->authenticate();

    // Fetch all ParcelBills with their related ParcelOrder and nested relationships
    $bills = ParcelBill::with([
        'order.items.product',
        'order.customer',
        // 'order.createdBy'
    ])
    ->where('created_by', $customer->id)

    ->orderBy('created_at', 'desc')->get();

    if ($bills->isEmpty()) {
        return response()->json(['message' => 'No bills found'], 404);
    }

    // Map through each bill and format response
    $result = $bills->map(function ($bill) {
        $order = $bill->order;

        return [
            'bill_id' => $bill->id,
            'parcel_order_id' => $bill->parcel_order_id,
            'subtotal' => round($bill->subtotal, 2),
            'gst' => round($bill->gst, 2),
            'grand_total' => round($bill->grand_total, 2),
            'created_at' => $bill->created_at?->format('Y-m-d H:i:s'),
            'updated_at' => $bill->updated_at?->format('Y-m-d H:i:s'),

            'customer' => $order->customer ?? 'Guest',

            // 'created_by' => $order->createdBy ? [
            //     'id' => $order->createdBy->id,
            //     'name' => $order->createdBy->name,
            //     'email' => $order->createdBy->email,
            //     'status' => $order->createdBy->status,
            //     'last_login_at' => $order->createdBy->last_login_at,
            //     'last_order_at' => $order->createdBy->last_order_at,
            // ] : null,

            'items' => $order->items->map(function ($item) {
                $total = $item->quantity * $item->product_price;
                $gst = ($total * $item->tax_rate) / 100;

                return [
                    'product_id' => $item->product_id,
                    'product_name' => $item->product?->name ?? 'N/A',
                    'product_price' => round($item->product_price, 2),
                    'quantity' => $item->quantity,
                    'tax_rate' => $item->tax_rate,
                    'total' => round($total, 2),
                    'gst' => round($gst, 2),
                ];
            }),
        ];
    });

    return response()->json($result);
}
//billing 
public function ParcelBillreportPrint()
{
    $user = JWTAuth::parseToken()->authenticate();

    $bookings = ParcelOrder::with(['user.customer', 'createdBy'])
        ->where('created_by', $user->id) // Optional: restrict to user's bookings
        ->orderBy('created_at', 'desc')
        ->get();

        // dd($bookings);
    if ($bookings->isEmpty()) {
        return response()->json(['message' => 'No bookings found'], 404);
    }

    $report = $bookings->map(function ($booking) {
        $customerDetails = Customer::with('userc.information')
            ->where('id', $booking->customer_id)
            ->first();

        $items = ParcelOrderItem::with('product')
            ->where('parcel_order_id', $booking->id)
            ->get();

        $subtotal = 0;
        $totalGst = 0;
        $billItems = [];

        foreach ($items as $item) {
            $total = $item->quantity * $item->product_price;
            $gst = ($total * $item->tax_rate) / 100;

            $billItems[] = [
                'product_id'    => $item->product_id,
                'quantity'      => $item->quantity,
                'product_name'  => optional($item->product)->name,
                'product_price' => $item->product_price,
                'total'         => round($total, 2),
                'gst'           => round($gst, 2),
                'tax_rate'      => $item->tax_rate,
            ];

            $subtotal += $total;
            $totalGst += $gst;
        }

        $kotBill = ParcelBill::where('parcel_order_id', $booking->id)->first();

        return [
            'booking_id'       => $booking->id,
            'kot_bill'         => $kotBill,
            'customer_details' => $customerDetails,
            'booking'          => $booking,
            'items'            => $billItems,
            'subtotal'         => round($subtotal, 2),
            'gst'              => round($totalGst, 2),
            'grand_total'      => round($subtotal + $totalGst, 2),
        ];
    });

    return response()->json($report);
}



//particular id
public function ParcelBillreportPrintId($parcelOrderId)
{
    $user = JWTAuth::parseToken()->authenticate();

    // Find the specific parcel order created by this user
    $booking = ParcelOrder::with(['user.customer', 'createdBy'])
        ->where('created_by', $user->id)
        ->where('id', $parcelOrderId)
        ->first();

    if (!$booking) {
        return response()->json(['message' => 'Booking not found'], 404);
    }

    // Get customer details
    $customerDetails = Customer::with('userc.information')
        ->where('id', $booking->customer_id)
        ->first();

    // Get ordered items
    $items = ParcelOrderItem::with('product')
        ->where('parcel_order_id', $booking->id)
        ->get();

    $subtotal = 0;
    $totalGst = 0;
    $billItems = [];

    foreach ($items as $item) {
        $total = $item->quantity * $item->product_price;
        $gst = ($total * $item->tax_rate) / 100;

        $billItems[] = [
            'product_id'    => $item->product_id,
            'quantity'      => $item->quantity,
            'product_name'  => optional($item->product)->name,
            'product_price' => $item->product_price,
            'total'         => round($total, 2),
            'gst'           => round($gst, 2),
            'tax_rate'      => $item->tax_rate,
        ];

        $subtotal += $total;
        $totalGst += $gst;
    }

    // Get KOT bill
    $kotBill = ParcelBill::where('parcel_order_id', $booking->id)->first();

    $report = [
        'booking_id'       => $booking->id,
        'kot_bill'         => $kotBill,
        'customer_details' => $customerDetails,
        'booking'          => $booking,
        'items'            => $billItems,
        'subtotal'         => round($subtotal, 2),
        'gst'              => round($totalGst, 2),
        'grand_total'      => round($subtotal + $totalGst, 2),
    ];

    return response()->json($report);
}




}
