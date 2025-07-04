<?php

namespace App\Http\Controllers\api;
use Tymon\JWTAuth\Facades\JWTAuth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\FamilyBooking;
use App\Models\KotTable;
use App\Models\Customer;
use App\Models\KotOrderItem;
use App\Models\KotBill;
use App\Models\Order;
use Illuminate\Support\Facades\Log;


use Illuminate\Support\Facades\DB;



class familyBookingController extends Controller
{
    //
    //  public function bookTables(Request $request)
    // {
    //     $request->validate([
    //         'customer_name' => 'required|string',
    //         'members_count' => 'required|integer',
    //         'table_ids' => 'required|array',
    //     ]);

    //     $booking = FamilyBooking::create([
    //         'customer_name' => $request->customer_name,
    //         'members_count' => $request->members_count,
    //     ]);

    //     $booking->tables()->sync($request->table_ids);
    //     KotTable::whereIn('id', $request->table_ids)->update(['status' => 'booked']);

    //     return response()->json([
    //         'message' => 'Tables booked successfully.',
    //         'booking' => $booking->load('tables'),
    //     ]);
    // }


    public function bookFamilyTableWithItems(Request $request)
{
    $user = JWTAuth::parseToken()->authenticate();

    Log::info($request->all());
    $request->validate([
        'customer_name'    => 'required|string',
        'customer_id'    => 'nullable|integer',
        'members_count'    => 'required|integer|min:1',
        'table_ids'        => 'required|array|min:1',
        'table_ids.*'      => 'exists:kot_tables,id',
        'items'            => 'required|array|min:1',
        'items.*.product_id'     => 'required|integer',
        'items.*.quantity'       => 'required|integer|min:1',
        'items.*.product_price'  => 'required|numeric|min:0',
        // 'items.*.tax_rate'  => 'required|numeric|min:0',

    ]);

    // Step 1: Create the family booking
    $booking = FamilyBooking::create([
        'customer_name' => $request->customer_name,
        'customer_id' => $request->customer_id,
        'created_by'   => $user->id,


        'members_count' => $request->members_count,
    ]);

    // Step 2: Attach tables to the booking
    $booking->tables()->sync($request->table_ids);

    // Step 3: Update table status to "booked"
    KotTable::whereIn('id', $request->table_ids)->update(['status' => 'booked']);


    // Step 4: Add the ordered items
   // dd($booking->id);
    foreach ($request->items as $item) {
        KotOrderItem::create([
            'family_booking_id' => $booking->id,

            'product_id'        => $item['product_id'],
            'quantity'          => $item['quantity'],
            'product_price'     => $item['product_price'],
            'tax_rate'=>$item['tax_rate'],

            'kot_generated'     => true,
        ]);
    }

    return response()->json([
        'message' => 'Booking and order saved successfully.',
        'booking_id' => $booking->id,
    ]);
}

public function updateFamilyTableWithItems(Request $request)
{
    $request->validate([
        'family_booking_id'      => 'required|integer|',
        'items'                  => 'required|array|min:1',
        'items.*.product_id'     => 'required|integer|',
        'items.*.quantity'       => 'required|integer|min:1',
        'items.*.product_price'  => 'required|numeric|min:0',
    ]);

    $familyBookingId = $request->input('family_booking_id');

    foreach ($request->items as $item) {
        KotOrderItem::create([
            'family_booking_id' => $familyBookingId,
            'product_id'        => $item['product_id'],
            'quantity'          => $item['quantity'],
            'product_price'     => $item['product_price'],
            'kot_generated'     => true,
        ]);
    }

    return response()->json([
        'message' => 'Items added successfully for Family Booking ID: ',
         'family_booking_id'=> $familyBookingId
    ]);
}



public function generateFamilyBookingBill($familyBookingId)
{
        $user = JWTAuth::parseToken()->authenticate();

    $booking = FamilyBooking::with(['tables','user.customer','createdBy'])->findOrFail($familyBookingId);

    // Log::info($booking);
    $items = KotOrderItem::where('family_booking_id', $familyBookingId)->get();
// Log::info($items);
     // Check if bill already exists
    // $existingBill = KotBill::where('family_booking_id', $familyBookingId)->first();
    //  if ($existingBill) {
    //     return response()->json([
    //         'message' => 'Bill has already been generated for this booking ID.',
    //         'bill_already_generated' => true,
    //         'kot_bill_id' => $existingBill->id,
    //     ], 409); // 409 Conflict
    // }




    // foreach ($items as $item) {
    //     $total = $item->quantity * $item->product_price;
    //     $billItems[] = [
    //         'product_id'    => $item->product_id,
    //         'quantity'      => $item->quantity,
    //          'product_name'  => $item->product ? $item->product->name : null, // add this
    //         'product_price' => $item->product_price,
    //         'total'         => $total,
    //     ];
    //     $subtotal += $total;
    // }

    $subtotal = 0;
$totalGst = 0;
$billItems = [];

foreach ($items as $item) {
    $total = $item->quantity * $item->product_price;
    $gst = ($total * $item->tax_rate) / 100; // Calculate GST for the item

    $billItems[] = [
        'product_id'    => $item->product_id,
        'quantity'      => $item->quantity,
        'product_name'  => $item->product ? $item->product->name : null,
        'product_price' => $item->product_price,
        'total'         => $total,
        'gst'           => round($gst, 2), // Store individual item GST
        'tax_rate'      => $item->tax_rate, // Optional, include for reference
    ];

    $subtotal += $total;
    $totalGst += $gst;
}

    $gst =$totalGst;
    $grandTotal = $subtotal + $gst;


    // Save the bill
    $kotBill = \App\Models\KotBill::create([
        'family_booking_id' => $booking->id,
        'customer_name'     => $booking->customer_name,
        'customer_id'=>$booking->customer_id,
        'tables'            => json_encode($booking->tables->pluck('table_no')->toArray()),
        'subtotal'          => $subtotal,
        'gst'               => $gst,
        'grand_total'       => $grandTotal,
        'created_by'   => $user->id,

    ]);

    // After saving bill → mark tables as available again

    KotTable::whereIn('id', $booking->tables->pluck('id'))->update(['status' => 'available']);

    return response()->json([
        'kot_bill_id' => $kotBill->id,
        'family_booking_id' => $booking->id,
        'customer_id'=>$booking->customer_id,
        'customer_name'     => $booking->customer_name,
        'customer_user'      => optional($booking->user)->only(['id', 'name', 'email']),
        'user_info'         => $booking->user && $booking->user->customer ? $booking->user->customer->toArray() : null,
         'created_by' => $booking->createdBy ? [
    'id' => $booking->createdBy->id,
    'name' => $booking->createdBy->name,
    'email' => $booking->createdBy->email,
    'status' => $booking->createdBy->status,
    'last_login_at' => $booking->createdBy->last_login_at,
    'last_order_at' => $booking->createdBy->last_order_at,
] : null,



        'tables'            => $booking->tables->pluck('table_no'),
        'items'             => $billItems,
        'subtotal'          => $subtotal,
        'gst'               => $gst,
        'grand_total'       => $grandTotal,
    ]);
}







    public function getBookings()
    {
        return FamilyBooking::with('tables')->get();
    }

   public function createFamilyKot(Request $request)
{
    $customer = JWTAuth::parseToken()->authenticate();
    $request->validate([
        'table_ids' => 'required|array',
        'table_ids.*' => 'required|exists:kot_tables,id',
        'items' => 'required|array|min:1',
        'items.*.product_id' => 'required|integer',
        'items.*.quantity' => 'required|integer|min:1',
        'items.*.product_price' => 'required|numeric|min:0',
    ]);
// 'created_by', $customer->id
    foreach ($request->table_ids as $tableId) {
        foreach ($request->items as $item) {
            KotOrderItem::create([
                'kot_table_id' => $tableId,
                'product_id' => $item['product_id'],
                'quantity' => $item['quantity'],
                'product_price' => $item['product_price'],
                'kot_generated' => true,
                // 'created_by'=> $customer->id
            ]);
        }
    }

    return response()->json(['message' => 'KOT created successfully for multiple tables.']);
}


public function getFamilyBookingKot($bookingId)
{

     $booking = FamilyBooking::findOrFail($bookingId);


      $tables = DB::table('family_booking_kots')
        ->join('kot_tables', 'family_booking_kots.kot_table_id', '=', 'kot_tables.id')
        ->where('family_booking_kots.family_booking_id', $bookingId)
        ->pluck('kot_tables.table_no');


    //  $items = DB::table('kot_order_items')
    // ->where('family_booking_id', $bookingId) // Replace with the actual variable
    // ->get();

     $items = DB::table('kot_order_items')
        ->join('product_services', 'kot_order_items.product_id', '=', 'product_services.id')
        ->where('kot_order_items.family_booking_id', $bookingId)
        ->select(
            'kot_order_items.id as item_id',
            'kot_order_items.product_id',
            'product_services.name as product_name',
            'kot_order_items.quantity',
            'kot_order_items.product_price'
        )
        ->get();

     return response()->json([
        'customer_name' => $booking->customer_name,
        'members_count' => $booking->members_count,
        'tables'        => $tables,
        'items'         => $items,
    ]);

}

//report for kot
public function getAllFamilyBookingKotReports()
{
    $bookings = FamilyBooking::all();

    

    $result = $bookings->map(function ($booking) {
        $tables = DB::table('family_booking_kots')
            ->join('kot_tables', 'family_booking_kots.kot_table_id', '=', 'kot_tables.id')
            ->where('family_booking_kots.family_booking_id', $booking->id)
            ->pluck('kot_tables.table_no');

        $items = DB::table('kot_order_items')
            ->join('product_services', 'kot_order_items.product_id', '=', 'product_services.id')
            ->where('kot_order_items.family_booking_id', $booking->id)
            ->select(
                'kot_order_items.id as item_id',
                'kot_order_items.product_id',
                'product_services.name as product_name',
                'kot_order_items.quantity',
                'kot_order_items.product_price'
            )
            ->get();

        return [
            'booking_id'    => $booking->id,
            'customer_name' => $booking->customer_name,
            'members_count' => $booking->members_count,
            'tables'        => $tables,
            'items'         => $items,
        ];
    });

    return response()->json($result);
}

// public function generateFamilyBookingBillreport($familyBookingId)
// {
//         $user = JWTAuth::parseToken()->authenticate();

//     $booking = FamilyBooking::with(['tables','user.customer','createdBy'])->findOrFail($familyBookingId);

//     // Log::info($booking);
//     $items = KotOrderItem::where('family_booking_id', $familyBookingId)->get();

//     $subtotal = 0;
// $totalGst = 0;
// $billItems = [];

// foreach ($items as $item) {
//     $total = $item->quantity * $item->product_price;
//     $gst = ($total * $item->tax_rate) / 100; // Calculate GST for the item

//     $billItems[] = [
//         'product_id'    => $item->product_id,
//         'quantity'      => $item->quantity,
//         'product_name'  => $item->product ? $item->product->name : null,
//         'product_price' => $item->product_price,
//         'total'         => $total,
//         'gst'           => round($gst, 2), // Store individual item GST
//         'tax_rate'      => $item->tax_rate, // Optional, include for reference
//     ];

//     $subtotal += $total;
//     $totalGst += $gst;
// }

//     $gst =$totalGst;
//     $grandTotal = $subtotal + $gst;


//     // Save the bill
//     $kotBill = \App\Models\KotBill::create([
//         'family_booking_id' => $booking->id,
//         'customer_name'     => $booking->customer_name,
//         'customer_id'=>$booking->customer_id,
//         'tables'            => json_encode($booking->tables->pluck('table_no')->toArray()),
//         'subtotal'          => $subtotal,
//         'gst'               => $gst,
//         'grand_total'       => $grandTotal,
//         'created_by'   => $user->id,

//     ]);

//     // After saving bill → mark tables as available again

//     KotTable::whereIn('id', $booking->tables->pluck('id'))->update(['status' => 'available']);

//     return response()->json([
//         'kot_bill_id' => $kotBill->id,
//         'family_booking_id' => $booking->id,
//         'customer_id'=>$booking->customer_id,
//         'customer_name'     => $booking->customer_name,
//         'customer_user'      => optional($booking->user)->only(['id', 'name', 'email']),
//         'user_info'         => $booking->user && $booking->user->customer ? $booking->user->customer->toArray() : null,
//          'created_by' => $booking->createdBy ? [
//     'id' => $booking->createdBy->id,
//     'name' => $booking->createdBy->name,
//     'email' => $booking->createdBy->email,
//     'status' => $booking->createdBy->status,
//     'last_login_at' => $booking->createdBy->last_login_at,
//     'last_order_at' => $booking->createdBy->last_order_at,
// ] : null,



//         'tables'            => $booking->tables->pluck('table_no'),
//         'items'             => $billItems,
//         'subtotal'          => $subtotal,
//         'gst'               => $gst,
//         'grand_total'       => $grandTotal,
//     ]);
// }

// public function generateFamilyBookingBillreport($familyBookingId)
// {
//     $user = JWTAuth::parseToken()->authenticate();

//     // Load booking without restricting by created_by yet
//     $booking = FamilyBooking::with(['tables', 'user.customer', 'createdBy'])
//     ->orderBy('created_at','desc')
//     ->findOrFail($familyBookingId);

//     // 🔐 Check if the authenticated user is allowed to access this booking
//     // if ((int) $booking->created_by !== (int) $user->id) {
//     //     return response()->json(['message' => 'Unauthorized'], 403);
//     // }

//     // Get customer info with nested user info
//     $customerDetails = Customer::with('userc.information')
//         ->where('id', $booking->customer_id)
//         ->first();

//     // Load order items
//     $items = KotOrderItem::with('product')
//         ->where('family_booking_id', $familyBookingId)
//         ->get();

//     $subtotal = 0;
//     $totalGst = 0;
//     $billItems = [];

//     foreach ($items as $item) {
//         $total = $item->quantity * $item->product_price;
//         $gst = ($total * $item->tax_rate) / 100;

//         $billItems[] = [
//             'product_id'    => $item->product_id,
//             'quantity'      => $item->quantity,
//             'product_name'  => optional($item->product)->name,
//             'product_price' => $item->product_price,
//             'total'         => round($total, 2),
//             'gst'           => round($gst, 2),
//             'tax_rate'      => $item->tax_rate,
//         ];

//         $subtotal += $total;
//         $totalGst += $gst;
//     }

//     $gst = round($totalGst, 2);
//     $grandTotal = round($subtotal + $gst, 2);

//     // Check if bill already exists
//     $kotBill = \App\Models\KotBill::where('family_booking_id', $familyBookingId)->first();

//     return response()->json([
//         'kotBill' => $kotBill,
//         'user' => $user,
//         'items' => $billItems, // return formatted items not raw
//         'customerDetails' => $customerDetails,
//         'booking' => $booking,
//         'subtotal' => round($subtotal, 2),
//         'gst' => $gst,
//         'grand_total' => $grandTotal,
//     ]);
// }


public function generateFamilyBookingBillreport()
{
    $user = JWTAuth::parseToken()->authenticate();

    $bookings = FamilyBooking::with(['tables', 'user.customer', 'createdBy'])
        ->where('created_by', $user->id) // Optional: restrict to user's bookings
        ->orderBy('created_at', 'desc')
        ->get();

    if ($bookings->isEmpty()) {
        return response()->json(['message' => 'No bookings found'], 404);
    }

    $report = $bookings->map(function ($booking) {
        $customerDetails = Customer::with('userc.information')
            ->where('id', $booking->customer_id)
            ->first();

        $items = KotOrderItem::with('product')
            ->where('family_booking_id', $booking->id)
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

        $kotBill = KotBill::where('family_booking_id', $booking->id)->first();

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







}
