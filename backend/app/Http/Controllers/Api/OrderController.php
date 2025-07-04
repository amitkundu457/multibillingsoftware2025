<?php

namespace App\Http\Controllers\Api;

use App\Models\Coin;
use App\Models\Order;
use App\Models\OrderDetails;
use App\Models\PurchaseItem;
use App\Models\OrderCoinSetting;

use App\Models\ProductService;
use App\Models\Payment;
 use App\Models\SaloonOrder;
use Carbon\Carbon;



use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Exports\OrderReportExport;
use Illuminate\Support\Facades\DB;
use Tymon\JWTAuth\Facades\JWTAuth;

use App\Exports\PurchaseBillExport;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\ProductWisePurchaseExport;


class OrderController extends Controller
{

    public function index()
{
    $orders = Order::with('details','payments')->get();

    $totalOrders = $orders->count();

    $thisMonthOrders = Order::whereMonth('created_at', Carbon::now()->month)
                            ->whereYear('created_at', Carbon::now()->year)
                            ->count();

    return response()->json([
        'orders' => $orders,
        'total_orders' => $totalOrders,
        'this_month_orders' => $thisMonthOrders,
    ]);
}

public function orderInvoice()
{
    $customer = JWTAuth::parseToken()->authenticate();
    Log::info('Authenticated Customer:', ['customer' => $customer]);

    // Filtered orders with relationships
    $orders = Order::with('details', 'payments')
        ->where('created_by', $customer->id)
        ->where('order_slip', '!=', 1)
        ->get();

    $totalOrders = $orders->count();

    // Count for current month with filters
    $thisMonthOrders = Order::where('created_by', $customer->id)
        ->where('order_slip', '!=', 1)
        ->whereMonth('created_at', Carbon::now()->month)
        ->whereYear('created_at', Carbon::now()->year)
        ->count();

    return response()->json([
        'orders' => $orders,
        'total_orders' => $totalOrders,
        'this_month_orders' => $thisMonthOrders,
    ]);
}



    public function OrderByCategory()
    {
        $orders = OrderDetails::select('product_code', \DB::raw('COUNT(*) as order_count'))
            ->groupBy('product_code')
            ->get();

        return response()->json($orders);
    }




// public function getTodayOrders()
// {
//     $customer = JWTAuth::parseToken()->authenticate();
//     Log::info('Authenticated Customer:', ['customer' => $customer]);

//     $today = Carbon::today(); // Get today's date

//     // Fetch orders created today
//     $todayOrders = Order::whereDate('created_at', $today)->get();

//     // Count repeat customers (customers who placed more than one order today)
//     $repeatCustomers = Order::whereDate('created_at', $today)
//         ->select('created_by') // Change this to 'customer_id' if needed
//         ->groupBy('created_by')
//         ->havingRaw('COUNT(created_by) > 1')
//         ->count();

//     return response()->json([
//         'today_orders' => $todayOrders->count(),
//         'repeat_customers' => $repeatCustomers
//     ]);
// }

public function getTodayOrders()
{
    $customer = JWTAuth::parseToken()->authenticate();
    Log::info('Authenticated Customer:', ['customer' => $customer]);

    $today = Carbon::today();

    // 1. Get today's orders by created_by (logged-in user), excluding order_slip = 1
    $todayOrders = Order::where('created_by', $customer->id)
        ->whereDate('created_at', $today)
        ->where('order_slip', '!=', 1)
        ->get();

    // 2. Count repeat customers by customer_id with more than 1 order today (exclude order_slip = 1)
    $repeatCustomers = Order::whereDate('created_at', $today)
        ->where('order_slip', '!=', 1)
        ->select('customer_id')
        ->groupBy('customer_id')
        ->havingRaw('COUNT(customer_id) > 1')
        ->count();

    return response()->json([
        'today_orders' => $todayOrders->count(),
        'repeat_customers' => $repeatCustomers
    ]);
}


//     public function storeCheckout(Request $request)
//     {
//         Log::info('Received Request Data:', $request->all());

//         try {
//             // Authenticate the customer
//             $customer = JWTAuth::parseToken()->authenticate();
//             Log::info('Authenticated Customer:', ['customer' => $customer]);

//             // Validate incoming request data
//             $validated = $request->validate([
//                 'paymentMethods' => 'required|array',
//                 'products' => 'required',
//                 'products.*.name' => 'required',
//                 'products.*.code' => 'nullable',
//                 'products.*.stoneWeight' => 'nullable',
//                 'products.*.stoneValue' => 'nullable',
//                 'products.*.huid' => 'nullable',
//                 'products.*.hallmark' => 'nullable',
//                 'products.*.hallmarkCharge' => 'nullable',
//                 'products.*.makingInRs' => 'nullable',
//                 'products.*.wastageCharge' => 'nullable',

//                 'products.*.grossWeight' => 'nullable',
//                 'products.*.netWeight' => 'nullable',
//                 'products.*.making' => 'nullable',
//                 'products.*.rate' => 'nullable',
//                // 'products.*.grm' => 'required',
//                 'grossTotal' => 'nullable',
//                 'discountTotal' => 'nullable',
//                 'dateid' => 'nullable',
//                 'customer_id' => 'required|',
//                 'price' => 'nullable',
//                 'tax_rate'=> 'nullable',
//                 'products.*pro_total' => 'required|array',
//                 'products.*.hsn' => 'nullable',
//                 'products.making_gst_percentage' => 'nullable',
//              ]);

//             // Retrieve total coins for the customer
//             $totalCoins = DB::table('coni_purchases')
//                 ->where('created_by', $customer->id)
//                 ->sum('coins');

//             if ($totalCoins <= 0) {
//                 return response()->json([
//                     'message' => 'Insufficient coins to deduct',
//                     'available_coins' => $totalCoins,
//                 ], 400);
//             }

//             // Deduct coin
//             $setting = OrderCoinSetting::latest()->first();

//             $coinToDeduct = $setting->coins_per_order; // ✅ get numeric value from model

//             $remainingCoins = $totalCoins - $coinToDeduct;
//             $coinsToDeduct = $coinToDeduct; // ✅ Define it here


//             // Update the database records
//             $coinRecords = DB::table('coni_purchases')
//                 ->where('created_by', $customer->id)
//                 ->orderBy('id', 'asc')
//                 ->get();

//                 foreach ($coinRecords as $record) {
//                 if ($coinsToDeduct <= 0) {
//                     break;
//                 }

//                 if ($record->coins > $coinsToDeduct) {
//                     // Partially deduct from this record
//                     DB::table('coni_purchases')
//                         ->where('id', $record->id)
//                         ->update(['coins' => $record->coins - $coinsToDeduct]);
//                     $coinsToDeduct = 0;
//                 } else {
//                     // Fully deduct this record
//                     DB::table('coni_purchases')
//                         ->where('id', $record->id)
//                         ->update(['coins' => 0]);
//                     $coinsToDeduct -= $record->coins;
//                 }
//             }


//             // Create the order record
//             $order = Order::create([
//                 // 'billno' => 'BN' . time(), // Generate a unique bill number
//                 'billno' => 'BN' . time() . rand(100, 999),
//                 'gross_total' => $validated['grossTotal'],
//                 'discount' => $validated['discountTotal'],
//                 'total_price' => $validated['grossTotal'] - $validated['discountTotal']+$request->totalTax+$request->additionRs,
//                 'customer_id' => $validated['customer_id'],
//                 'created_by' => $customer->id,
//                 'bill_inv' => $request->bill_inv,
//                 'salesman_id' => $request->salesman_id,
//                 'stylist_id' => $request->stylist_id,
//                 'order_slip' => $request->order_slip,
//                 'date' => $validated['dateid'],
//                 'discountPercent'=>$request->discountPercent,
//                 'discountRs'=>$request->discountRs,
//                 'additionRS'=>$request->additionRs,
//                 'additionDetail'=>$request->additionDetail,
//                 'totalqty'=>$request->totalqty,
//                 'totalTax'=>$request->totalTax,
//                 'minAdjAmt'=>$request->minAdjAmt,
//                 'minAdAmt'=>$request->minAdAmt,


//             ]);
//            // Update last_order_at for the customer
//             DB::table('customers')
//            ->where('user_id', $validated['customer_id'])
//            ->update(['last_order_at' => now()]);

//            foreach ($validated['products'] as $product) {
//             $order->details()->create([
//                 'product_name' => $product['name'],
//                 'product_id'=> $product['product_id'] ?? null,
//                 'product_code' => $product['code'],
//                 'gross_weight' => $product['grossWeight'],
//                 'net_weight' => $product['netWeight'],
//                 'making' => $product['making'],
//                 'makingInRs'=> $product['makingInRs'],
//                 'rate' => $product['rate'],
//                 'tax_rate' => $product['tax_rate'],
//                 'pro_total' => number_format((float) $product['pro_total'], 2, '.', ''), // Fixing decimal issue
//                 'stone_weight' => $product['stoneWeight'] ?? null,
//                 'stone_value' => $product['stoneValue'] ?? null,
//                 'huid' => $product['huid'] ?? null,
//                 'hallmark' => $product['hallmark'] ?? null,
//                 'qty' => $product['qty'] ?? null,
//                 'hallmarkCharge' => $product['hallmarkCharge'] ?? null,
//                 'wastageCharge' => $product['wastageCharge'] ?? null,
//                 'hsn' => $product['hsn'] ?? null,
//                 'making_dsc' => $product['making_dsc'] ?? null,
//                 'metal_value' => $product['metal_value'] ?? null,
//                 'otherCharge' => $product['otherCharge'] ?? null,
//                 'diamondDetails' => $product['diamondDetails'] ?? null,
//                 'diamondValue' => $product['diamondValue'] ?? null,
//                 'description'=>$product['description'] ?? null,
//                 'making_gst_percentage'=>$product['making_gst_percentage'] ?? null,
//                // 'grm' => $product['grm'] ?? null,
//             ]);
//         }


//             // Loop through the payment methods and store each one
//            foreach ($validated['paymentMethods'] as $paymentData) {
//           Payment::create([
//          'order_id' => $order->id,
//          'customer_id' => $validated['customer_id'],
//          'payment_date' => now(),
//          'payment_method' => $paymentData['payment_method'],  // payment method (cash, card, upi,other)
//          'price' => $paymentData['price'],  // payment amount
//           ]);
//          }



// //          if (!empty($request->payments) && is_array($request->payments)) {
// //     foreach ($request->payments as $paymentData) {
// //         // Store each payment method (cash, card, upi, etc.)
// //         Payment::create([
// //             'order_id' => $request->order_id,
// //             'customer_id' => $request->customer_id,
// //             'payment_date' => $request->payment_date,
// //             'payment_method' => $paymentData['payment_method'],
// //             'price' => $paymentData['price'],
// //         ]);
// //     }
// // } else {
// //     Log::error('Payments data is missing or invalid', ['payments' => $request->payments]);
// //     return response()->json([
// //         'message' => 'Payments data is missing or invalid',
// //     ], 400);
// // }


//             // // Store payment details
//             // Payment::create([
//             //     'order_id' => $order->id,
//             //     'customer_id' => $validated['customer_id'],
//             //     'price' => $validated['price'],
//             //     'payment_date' => now(),
//             //     'payment_method' => $validated['paymentMethod'],
//             // ]);

//             // Return a success response
//             return response()->json([
//                 'message' => 'Order placed successfully',
//                 'order_id' => $order->id,
//                 'bill_inv' => $order->bill_inv,
//             ], 201);
//         } catch (\Illuminate\Validation\ValidationException $e) {
//             Log::error('Validation Error:', ['errors' => $e->errors()]);
//             return response()->json([
//                 'message' => 'Validation failed',
//                 'errors' => $e->errors(),
//             ], 422);
//         } catch (\Exception $e) {
//             Log::error('Error in Checkout:', ['message' => $e->getMessage()]);
//             return response()->json([
//                 'message' => 'An error occurred while placing the order',
//                 'error' => $e->getMessage(),
//             ], 500);
//         }
//     }


public function storeCheckout(Request $request)
{
    Log::info('Received Request Data:', $request->all());

    try {
        DB::beginTransaction(); // ✅ Begin DB transaction

        // Authenticate the customer
        $customer = JWTAuth::parseToken()->authenticate();
        Log::info('Authenticated Customer:', ['customer' => $customer]);

        // Validate request
        $validated = $request->validate([
            'paymentMethods' => 'required|array',
            'products' => 'required',
            'products.*.name' => 'required',
            'products.*.code' => 'nullable',
            'products.*.stoneWeight' => 'nullable',
            'products.*.stoneValue' => 'nullable',
            'products.*.huid' => 'nullable',
            'products.*.hallmark' => 'nullable',
            'products.*.hallmarkCharge' => 'nullable',
            'products.*.makingInRs' => 'nullable',
            'products.*.wastageCharge' => 'nullable',
            'products.*.grossWeight' => 'nullable',
            'products.*.netWeight' => 'nullable',
            'products.*.making' => 'nullable',
            'products.*.rate' => 'nullable',
            'grossTotal' => 'nullable',
            'discountTotal' => 'nullable',
            'dateid' => 'nullable',
            'customer_id' => 'required',
            'price' => 'nullable',
            'tax_rate'=> 'nullable',
            'products.*pro_total' => 'required|array',
            'products.*.hsn' => 'nullable',
            'products.making_gst_percentage' => 'nullable',
        ]);

        // // Check coins
        // $totalCoins = DB::table('coni_purchases')
        //     ->where('created_by', $customer->id)
        //     ->sum('coins');

        // if ($totalCoins <= 0) {
        //     return response()->json([
        //         'message' => 'Insufficient coins to deduct',
        //         'available_coins' => $totalCoins,
        //     ], 400);
        // }

        // // Deduct coins
        // $setting = OrderCoinSetting::latest()->first();
        // $coinToDeduct = $setting->coins_per_order;
        // $coinsToDeduct = $coinToDeduct;
        // $coinRecords = DB::table('coni_purchases')
        //     ->where('created_by', $customer->id)
        //     ->orderBy('id', 'asc')
        //     ->get();

        // foreach ($coinRecords as $record) {
        //     if ($coinsToDeduct <= 0) break;

        //     if ($record->coins > $coinsToDeduct) {
        //         DB::table('coni_purchases')->where('id', $record->id)->update([
        //             'coins' => $record->coins - $coinsToDeduct
        //         ]);
        //         $coinsToDeduct = 0;
        //     } else {
        //         DB::table('coni_purchases')->where('id', $record->id)->update(['coins' => 0]);
        //         $coinsToDeduct -= $record->coins;
        //     }
        // }

        // ✅ Fetch bill count
        $billCount = DB::table('bill_counts')->where('created_by', $customer->id)->first();
        $currentBillCount = $billCount ? $billCount->bill_count + 1 : 1;

        // ✅ Create the order
        $order = Order::create([
            'billno' => 'BN' . time() . rand(100, 999),
            'gross_total' => $validated['grossTotal'],
            'discount' => $validated['discountTotal'],
            'total_price' => $validated['grossTotal'] - $validated['discountTotal'] + $request->totalTax + $request->additionRs,
            'customer_id' => $validated['customer_id'],
            'created_by' => $customer->id,
            'bill_inv' => $request->bill_inv,
            'salesman_id' => $request->salesman_id,
            'stylist_id' => $request->stylist_id,
            'order_slip' => $request->order_slip,
            'date' => $validated['dateid'],
            'discountPercent' => $request->discountPercent,
            'discountRs' => $request->discountRs,
            'additionRS' => $request->additionRs,
            'additionDetail' => $request->additionDetail,
            'totalqty' => $request->totalqty,
            'totalTax' => $request->totalTax,
            'minAdjAmt' => $request->minAdjAmt,
            'minAdAmt' => $request->minAdAmt,
            'billcountnumber' => $request->order_slip == 1 ? $currentBillCount : $currentBillCount, // If order_slip == 1, set billcountNumber to currentBillCount
        ]);

        // ✅ Only update bill_counts if order_slip is not 1
        if ($request->order_slip != 1) {
            if (!$billCount) {
                DB::table('bill_counts')->insert([
                    'created_by' => $customer->id,
                    'bill_count' => 1,
                ]);
            } else {
                DB::table('bill_counts')->where('created_by', $customer->id)->update([
                    'bill_count' => $currentBillCount,
                ]);
            }
        }

        // Update last_order_at
        DB::table('customers')->where('user_id', $validated['customer_id'])->update([
            'last_order_at' => now()
        ]);

        // Create order details
        foreach ($validated['products'] as $product) {
            $order->details()->create([
                'product_name' => $product['name'],
                'product_id'=> $product['product_id'] ?? null,
                'product_code' => $product['code'],
                'gross_weight' => $product['grossWeight'],
                'net_weight' => $product['netWeight'],
                'making' => $product['making'],
                'makingInRs'=> $product['makingInRs'],
                'rate' => $product['rate'],
                'tax_rate' => $product['tax_rate'],
                'pro_total' => number_format((float) $product['pro_total'], 2, '.', ''),
                'stone_weight' => $product['stoneWeight'] ?? null,
                'stone_value' => $product['stoneValue'] ?? null,
                'huid' => $product['huid'] ?? null,
                'hallmark' => $product['hallmark'] ?? null,
                'qty' => $product['qty'] ?? null,
                'hallmarkCharge' => $product['hallmarkCharge'] ?? null,
                'wastageCharge' => $product['wastageCharge'] ?? null,
                'hsn' => $product['hsn'] ?? null,
                'making_dsc' => $product['making_dsc'] ?? null,
                'metal_value' => $product['metal_value'] ?? null,
                'otherCharge' => $product['otherCharge'] ?? null,
                'diamondDetails' => $product['diamondDetails'] ?? null,
                'diamondValue' => $product['diamondValue'] ?? null,
                'description' => $product['description'] ?? null,
                'making_gst_percentage' => $product['making_gst_percentage'] ?? null,
                'ad_wgt' => $product['ad_wgt'] ?? null,
                'gstOnGold' => $product['gstOnGold'] ?? null,
                'gstOnMaking' => $product['gstOnMaking'] ?? null,
                'mkg_chg_RS_P' => $product['mkg_chg_RS_P'] ?? null,
                

            ]);
        }

        // Store payment methods
        foreach ($validated['paymentMethods'] as $paymentData) {
            Payment::create([
                'order_id' => $order->id,
                'customer_id' => $validated['customer_id'],
                'payment_date' => now(),
                'payment_method' => $paymentData['payment_method'],
                'price' => $paymentData['price'],
            ]);
        }

        DB::commit(); // ✅ Commit transaction

        return response()->json([
            'message' => 'Order placed successfully',
            'order_id' => $order->id,
            'bill_inv' => $order->bill_inv,
        ], 201);

    } catch (\Illuminate\Validation\ValidationException $e) {
        DB::rollBack();
        Log::error('Validation Error:', ['errors' => $e->errors()]);
        return response()->json([
            'message' => 'Validation failed',
            'errors' => $e->errors(),
        ], 422);

    } catch (\Exception $e) {
        DB::rollBack();
        Log::error('Error in Checkout:', ['message' => $e->getMessage()]);
        return response()->json([
            'message' => 'An error occurred while placing the order',
            'error' => $e->getMessage(),
        ], 500);
    }
}



    //restroOrder 
    public function storeCheckoutResto(Request $request)
    {
        Log::info('Received Request Data:', $request->all());

        try {
            // Authenticate the customer
            $customer = JWTAuth::parseToken()->authenticate();
            Log::info('Authenticated Customer:', ['customer' => $customer]);

            // Validate incoming request data
            $validated = $request->validate([
                'paymentMethods' => 'required|array',
                'products' => 'required',
                'products.*.name' => 'required',
                'products.*.code' => 'nullable',
                'products.*.stoneWeight' => 'nullable',
                'products.*.stoneValue' => 'nullable',
                'products.*.huid' => 'nullable',
                'products.*.hallmark' => 'nullable',
                'products.*.hallmarkCharge' => 'nullable',
                'products.*.makingInRs' => 'nullable',
                'products.*.wastageCharge' => 'nullable',

                'products.*.grossWeight' => 'nullable',
                'products.*.netWeight' => 'nullable',
                'products.*.making' => 'nullable',
                'products.*.rate' => 'nullable',
               // 'products.*.grm' => 'required',
                'grossTotal' => 'nullable',
                'discountTotal' => 'nullable',
                'dateid' => 'nullable',
                'customer_id' => 'required|',
                'price' => 'nullable',
                'tax_rate'=> 'nullable',
                // 'products.*pro_total' => 'required|array',
                'products.*.pro_total' => 'nullable|numeric',
                'products.*.hsn' => 'nullable',
                'products.making_gst_percentage' => 'nullable',
             ]);

            // Retrieve total coins for the customer
            // $totalCoins = DB::table('coni_purchases')
            //     ->where('created_by', $customer->id)
            //     ->sum('coins');

            // if ($totalCoins <= 0) {
            //     return response()->json([
            //         'message' => 'Insufficient coins to deduct',
            //         'available_coins' => $totalCoins,
            //     ], 400);
            // }

            // // Deduct coin
            // $setting = OrderCoinSetting::latest()->first();

            // $coinToDeduct = $setting->coins_per_order; // ✅ get numeric value from model

            // $remainingCoins = $totalCoins - $coinToDeduct;
            // $coinsToDeduct = $coinToDeduct; // ✅ Define it here


            // // Update the database records
            // $coinRecords = DB::table('coni_purchases')
            //     ->where('created_by', $customer->id)
            //     ->orderBy('id', 'asc')
            //     ->get();

            //     foreach ($coinRecords as $record) {
            //     if ($coinsToDeduct <= 0) {
            //         break;
            //     }

            //     if ($record->coins > $coinsToDeduct) {
            //         // Partially deduct from this record
            //         DB::table('coni_purchases')
            //             ->where('id', $record->id)
            //             ->update(['coins' => $record->coins - $coinsToDeduct]);
            //         $coinsToDeduct = 0;
            //     } else {
            //         // Fully deduct this record
            //         DB::table('coni_purchases')
            //             ->where('id', $record->id)
            //             ->update(['coins' => 0]);
            //         $coinsToDeduct -= $record->coins;
            //     }
            // }


            // Create the order record
            $order = Order::create([
                // 'billno' => 'BN' . time(), // Generate a unique bill number
                'billno' => 'BN' . time() . rand(100, 999),
                'gross_total' => $validated['grossTotal'],
                'discount' => $validated['discountTotal'],
                'total_price' => $validated['grossTotal'] - $validated['discountTotal']+$request->totalTax+$request->additionRs,
                'customer_id' => $validated['customer_id'],
                'created_by' => $customer->id,
                'bill_inv' => $request->bill_inv,
                'salesman_id' => $request->salesman_id,
                'stylist_id' => $request->stylist_id,
                'order_slip' => $request->order_slip,
                'date' => $validated['dateid'],
                'discountPercent'=>$request->discountPercent,
                'discountRs'=>$request->discountRs,
                'additionRS'=>$request->additionRs,
                'additionDetail'=>$request->additionDetail,
                'totalqty'=>$request->totalqty,
                'totalTax'=>$request->totalTax,
                'minAdjAmt'=>$request->minAdjAmt,
                'minAdAmt'=>$request->minAdAmt,


            ]);
           // Update last_order_at for the customer
            DB::table('customers')
           ->where('user_id', $validated['customer_id'])
           ->update(['last_order_at' => now()]);

           foreach ($validated['products'] as $product) {
            $order->details()->create([
                'product_name' => $product['name'],
                'product_id'=> $product['product_id'],
                'product_code' => $product['code'],
                'gross_weight' => $product['grossWeight'] ?? null,
                'net_weight' => $product['netWeight'] ?? null,
                'making' => $product['making'] ?? null,
                'makingInRs'=> $product['makingInRs'] ?? null,
                'rate' => $product['rate'] ?? null,
                'tax_rate' => $product['tax_rate'] ?? null,
                // 'pro_total' => number_format((float) $product['pro_total'] ?? null, 2, '.', ''), // Fixing decimal issue
                'pro_total' => number_format((float) ($product['pro_total'] ?? 0), 2, '.', ''),
                'stone_weight' => $product['stoneWeight'] ?? null,
                'stone_value' => $product['stoneValue'] ?? null,
                'huid' => $product['huid'] ?? null,
                'hallmark' => $product['hallmark'] ?? null,
                'qty' => $product['qty'] ?? null,
                'hallmarkCharge' => $product['hallmarkCharge'] ?? null,
                'wastageCharge' => $product['wastageCharge'] ?? null,
                'hsn' => $product['hsn'] ?? null,
                'making_dsc' => $product['making_dsc'] ?? null,
                'metal_value' => $product['metal_value'] ?? null,
                'otherCharge' => $product['otherCharge'] ?? null,
                'diamondDetails' => $product['diamondDetails'] ?? null,
                'diamondValue' => $product['diamondValue'] ?? null,
                'description'=>$product['description'] ?? null,
                'making_gst_percentage'=>$product['making_gst_percentage'] ?? null,
               // 'grm' => $product['grm'] ?? null,
            ]);
        }


            // Loop through the payment methods and store each one
           foreach ($validated['paymentMethods'] as $paymentData) {
          Payment::create([
         'order_id' => $order->id,
         'customer_id' => $validated['customer_id'],
         'payment_date' => now(),
         'payment_method' => $paymentData['payment_method'],  // payment method (cash, card, upi,other)
         'price' => $paymentData['price'],  // payment amount
          ]);
         }



            // Return a success response
            return response()->json([
                'message' => 'Order placed successfully',
                'order_id' => $order->id,
                'bill_inv' => $order->bill_inv,
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('Validation Error:', ['errors' => $e->errors()]);
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            Log::error('Error in Checkout:', ['message' => $e->getMessage()]);
            return response()->json([
                'message' => 'An error occurred while placing the order',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    // public function generateNextBillNo()
    // {
    //     // Get authenticated user
    //     $user = JWTAuth::parseToken()->authenticate();

    //     // Check if user exists
    //     if (!$user) {
    //         return response()->json(['error' => 'Unauthorized'], 401);
    //     }

    //     // Extract first and last name initials from the full name
    //     $nameParts = explode(" ", trim($user->name));
    //     $firstLetter = strtoupper(substr($nameParts[0] ?? '', 0, 1)); // First letter of first word
    //     $lastLetter = strtoupper(substr(end($nameParts) ?? '', 0, 1)); // Last letter of last word

    //     // Get the last inserted ID from the orders table
    //     $lastId = DB::table('orders')->max('id') ?? 0; // Default to 0 if no records exist

    //     // Increment ID for the next bill number
    //     $nextBillId = $lastId + 1;

    //     // Get today's full date (e.g., "2025-02-15")
    //     $dateSuffix = now()->format('Y-m-d'); // Full date format

    //     // Generate the new bill number in the format: BN{ID}-{YYYY-MM-DD}
    //     $newBillNo = "INV/{$nextBillId}-{$dateSuffix}";

    //     // Debugging: Log the generated bill number
    //     \Log::info("Last ID: $lastId | Next Bill No: $newBillNo");

    //     return $newBillNo;
    // }


    public function generateNextBillNo()
    {
        // Get authenticated user
        $user = JWTAuth::parseToken()->authenticate();

        // Ensure user exists
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        // Extract initials from user's name
        $nameParts = explode(" ", trim($user->name));
        $firstInitial = strtoupper(substr($nameParts[0] ?? '', 0, 1)); // First letter of first name
        $lastInitial = strtoupper(substr(end($nameParts) ?? '', 0, 1)); // First letter of last name
        $initials = $firstInitial . $lastInitial; // Combine initials (e.g., "SK")

        // Get the last inserted order ID
        $lastOrder = DB::table('orders')->latest('id')->first();
        $lastId = $lastOrder ? $lastOrder->id : 0;

        // Increment order ID for next bill number
        $nextBillId = str_pad($lastId + 1, 3, '0', STR_PAD_LEFT); // Ensure 3-digit format (e.g., "001")

        // Determine financial year (April-March system)
        $currentYear = now()->year;
        $financialYear = (now()->month >= 4) ? "{$currentYear}-" . ($currentYear + 1) : ($currentYear - 1) . "-{$currentYear}";

        // Generate bill number in the format: SK/INV/RE/24-25/001
        $newBillNo = "INV/{$initials}/{$financialYear}/{$nextBillId}";

        // Debugging: Log generated bill number
        \Log::info("Generated Bill No: $newBillNo");

        return $newBillNo;
    }


    public function generateNextOrderBillNo()
    {
        // Get authenticated user
        $user = JWTAuth::parseToken()->authenticate();

        // Ensure user exists
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        // Extract initials from user's name
        $nameParts = explode(" ", trim($user->name));
        $firstInitial = strtoupper(substr($nameParts[0] ?? '', 0, 1)); // First letter of first name
        $lastInitial = strtoupper(substr(end($nameParts) ?? '', 0, 1)); // First letter of last name
        $initials = $firstInitial . $lastInitial; // Combine initials (e.g., "SK")

        // Get the last inserted order ID
        $lastOrder = DB::table('orders')->latest('id')->first();
        $lastId = $lastOrder ? $lastOrder->id : 0;

        // Increment order ID for next bill number
        $nextBillId = str_pad($lastId + 1, 3, '0', STR_PAD_LEFT); // Ensure 3-digit format (e.g., "001")

        // Determine financial year (April-March system)
        $currentYear = now()->year;
        $financialYear = (now()->month >= 4) ? "{$currentYear}-" . ($currentYear + 1) : ($currentYear - 1) . "-{$currentYear}";

        // Generate bill number in the format: SK/INV/RE/24-25/001
        $newBillNo = "ORD/{$financialYear}/{$nextBillId}";

        // Debugging: Log generated bill number
        \Log::info("Generated Bill No: $newBillNo");

        return $newBillNo;
    }







    public function printdata($id)
    {

        // Retrieve the order and its related details
        $invoice = Order::with(['details', 'users', 'users.customers', 'payments',])->findOrFail($id);

        // Calculate total payment and due payment
        $totalPayment = $invoice->payments->sum('price');
        $duePayment = $invoice->total_price - $totalPayment;

        // Append the calculated values to the response
        $invoiceData = $invoice->toArray();
        $invoiceData['total_payment'] = $totalPayment;
        $invoiceData['due_payment'] = $duePayment;

        return response()->json($invoiceData);
    }
    // public function printdata($id)
    // {
    //     // Retrieve the order and its related details (assuming you want order and products related to the invoice)
    //     $invoice = Order::with(['details','users','users.customers'])->findOrFail($id);

    //     // Return the invoice data as JSON
    //     return response()->json($invoice);
    // }

    public function orderslipdata(Request $request)
    {
        // Retrieve query parameters
        $startDate = $request->query('start_date');
        $endDate = $request->query('end_date');

        // Build the query
        $query = Order::with(['details', 'users', 'users.customers', 'payments'])
            ->where('order_slip', 1);

        // Apply date filters if provided
        if ($startDate) {
            $query->whereDate('created_at', '>=', $startDate);
        }

        if ($endDate) {
            $query->whereDate('created_at', '<=', $endDate);
        }

        // Execute the query and get results
        $orders = $query->get();

        // Return the response as JSON
        return response()->json($orders);
    }


    public function billingData(Request $request)
    {
        // Retrieve query parameters
        $startDate = $request->query('start_date');
        $endDate = $request->query('end_date');

        // Build the query
        $query = Order::with(['details', 'users', 'users.customers', 'payments'])
            ->where('order_slip', 0);

        // Apply date filters if provided
        if ($startDate) {
            $query->whereDate('created_at', '>=', $startDate);
        }

        if ($endDate) {
            $query->whereDate('created_at', '<=', $endDate);
        }

        // Execute the query and get results
        $orders = $query->get();

        // Return the response as JSON
        return response()->json($orders);
    }


    public function partialOrderData(Request $request)
    {
        // Authenticate the customer
        $customer = JWTAuth::parseToken()->authenticate();
        Log::info('Authenticated Customer:', ['customer' => $customer]);

        // Build the query with the necessary relationships
        $orders = Order::with(['details', 'users', 'users.customers', 'payments'])
            ->where('created_by', $customer->id)
            ->where('bill_inv', '!=' ,1) // Filter orders where bill_inv is NULL
            ->where('order_slip','!=' ,1)
            ->orderBy('created_at', 'desc')

            ->get()
            ->map(function ($order) {
                // Calculate total payments for the order
                $totalPayment = $order->payments->sum('price'); // Sum all payments

                // Calculate the due amount
                $duePayment = $order->total_price - $totalPayment;

                // Add calculated fields to the order
                $order->total_payment = $totalPayment;
                $order->due_payment = $duePayment;

                return $order;
            });

        return response()->json([
            'message' => 'Successfully fetched partial order data',
            'data' => $orders,
        ], 200);
    }


    public function storePartialOrderData(Request $request)
    {
        // Validate the request
        $validatedData = $request->validate([
            'order_id' => 'required|integer',
            'customer_id' => 'required|integer',
            'payment_date' => 'required|date',
            'payment_method' => 'required|string',
            'price' => 'required|numeric',
        ]);

        try {
            // Save payment data to the database
            $payment = new Payment();
            $payment->order_id = $validatedData['order_id'];
            $payment->customer_id = $validatedData['customer_id'];
            $payment->payment_date = $validatedData['payment_date'];
            $payment->payment_method = $validatedData['payment_method'];
            $payment->price = $validatedData['price'];
            $payment->save();

            return response()->json([
                'success' => true,
                'message' => 'Payment data saved successfully!',
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to save payment data.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }


    // public function OrderSlip(Request $request)
    // {
    //     try {
    //         // Authenticate the customer
    //         $customer = JWTAuth::parseToken()->authenticate();
    //         Log::info('Authenticated Customer:', ['customer' => $customer]);

    //         // Validate incoming request data
    //         $validated = $request->validate([
    //             'paymentMethod' => 'nullable|string',
    //             'products' => 'required|array|min:1',
    //             'products.*.name' => 'required|string',
    //             'products.*.code' => 'required|string',
    //             'products.*.stoneWeight' => 'nullable|numeric',
    //             'products.*.stoneValue' => 'nullable|numeric',
    //             'products.*.huid' => 'nullable|string',
    //             'products.*.hallmark' => 'nullable|string',
    //             'products.*.grossWeight' => 'required|numeric',
    //             'products.*.netWeight' => 'required|numeric',
    //             'products.*.making' => 'nullable|numeric',
    //             'products.*.rate' => 'required|numeric',
    //             'products.*.metal_value' => 'nullable',
    //             'products.*.making_dsc' => 'nullable|numeric',
    //             'products.*.pro_total' => 'required',
    //             'grossTotal' => 'required|numeric',
    //             'discountTotal' => 'required|numeric',
    //             'dateid' => 'required|date',
    //             'customer_id' => 'required|',
    //             'price' => 'required|numeric|min:0',
    //         ]);

    //         // Retrieve total coins for the customer
    //         $totalCoins = DB::table('coni_purchases')
    //             ->where('created_by', $customer->id)
    //             ->sum('coins');

    //         if ($totalCoins <= 0) {
    //             return response()->json([
    //                 'message' => 'Insufficient coins to deduct',
    //                 'available_coins' => $totalCoins,
    //             ], 400);
    //         }

    //         // Deduct one coin
    //         $remainingCoins = $totalCoins - 1;

    //         // Update the database records
    //         $coinRecords = DB::table('coni_purchases')
    //             ->where('created_by', $customer->id)
    //             ->orderBy('id', 'asc')
    //             ->get();

    //         $coinsToDeduct = 1;
    //         foreach ($coinRecords as $record) {
    //             if ($coinsToDeduct <= 0) {
    //                 break;
    //             }

    //             if ($record->coins > $coinsToDeduct) {
    //                 // Partially deduct from this record
    //                 DB::table('coni_purchases')
    //                     ->where('id', $record->id)
    //                     ->update(['coins' => $record->coins - $coinsToDeduct]);
    //                 $coinsToDeduct = 0;
    //             } else {
    //                 // Fully deduct this record
    //                 DB::table('coni_purchases')
    //                     ->where('id', $record->id)
    //                     ->update(['coins' => 0]);
    //                 $coinsToDeduct -= $record->coins;
    //             }
    //         }


    //         // Create the order record
    //         $order = Order::create([
    //             'billno' => 'ORD' . time(), // Generate a unique bill number
    //             'gross_total' => $validated['grossTotal'],
    //             'discount' => $validated['discountTotal'],
    //             'total_price' => $validated['grossTotal'] - $validated['discountTotal'],
    //             'customer_id' => $validated['customer_id'],
    //             'created_by' => $customer->id,
    //             'bill_inv' => $request->bill_inv,
    //             'salesman_id' => $request->salesman_id,
    //             'stylist_id' => $request->stylist_id,
    //             'order_slip' => 1,
    //             'date' => $validated['dateid'],
    //         ]);

    //         // Store each product in the order details
    //         foreach ($validated['products'] as $product) {
    //             $order->details()->create([
    //                 'product_name' => $product['name'],
    //                 'product_code' => $product['code'],
    //                 'gross_weight' => $product['grossWeight'],
    //                 'net_weight' => $product['netWeight'],
    //                 'making' => $product['making'],
    //                 'metal_value' => $product['metal_value'],
    //                 'making_dsc' => $product['making_dsc'],
    //                 'pro_total' => $product['pro_total'],
    //                 'rate' => $product['rate'],
    //                 'stone_weight' => $product['stoneWeight'] ?? null,
    //                 'stone_value' => $product['stoneValue'] ?? null,
    //                 'huid' => $product['huid'] ?? null,
    //                 'hallmark' => $product['hallmark'] ?? null,
    //             ]);
    //         }

    //         // Store payment details
    //         Payment::create([
    //             'order_id' => $order->id,
    //             'customer_id' => $validated['customer_id'],
    //             'price' => $validated['price'],
    //             'payment_date' => now(),
    //             'payment_method' => $validated['paymentMethod'],
    //         ]);

    //         // Return a success response
    //         return response()->json([
    //             'message' => 'Order placed successfully',
    //             'order_id' => $order->id,
    //             'bill_inv' => $order->bill_inv,
    //         ], 201);
    //     } catch (\Illuminate\Validation\ValidationException $e) {
    //         Log::error('Validation Error:', ['errors' => $e->errors()]);
    //         return response()->json([
    //             'message' => 'Validation failed',
    //             'errors' => $e->errors(),
    //         ], 422);
    //     } catch (\Exception $e) {
    //         Log::error('Error in Checkout:', ['message' => $e->getMessage()]);
    //         return response()->json([
    //             'message' => 'An error occurred while placing the order',
    //             'error' => $e->getMessage(),
    //         ], 500);
    //     }
    // }

    public function OrderSlip(Request $request)
    {
        try {
            // Authenticate the customer
            $customer = JWTAuth::parseToken()->authenticate();
            Log::info('Authenticated Customer:', ['customer' => $customer]);

            // Validate incoming request data
            $validated = $request->validate([
                'paymentMethods' => 'required|array',
                'products' => 'required',
                'products.*.name' => 'required',
                'products.*.code' => 'nullable',
                'products.*.stoneWeight' => 'nullable',
                'products.*.stoneValue' => 'nullable',
                'products.*.huid' => 'nullable',
                'products.*.hallmark' => 'nullable',
                'products.*.hallmarkCharge' => 'nullable',
                'products.*.makingInRs' => 'nullable',
                'products.*.wastageCharge' => 'nullable',

                'products.*.grossWeight' => 'nullable',
                'products.*.netWeight' => 'nullable',
                'products.*.making' => 'nullable',
                'products.*.rate' => 'nullable',
               // 'products.*.grm' => 'required',
                'grossTotal' => 'nullable',
                'discountTotal' => 'nullable',
                'dateid' => 'nullable',
                'customer_id' => 'required|',
                'price' => 'nullable',
                'tax_rate'=> 'nullable',
                'products.*pro_total' => 'required|array',
                'products.*.hsn' => 'nullable',
                'making_gst_percentage'=>'nullable',
             ]);

            // Retrieve total coins for the customer
            // $totalCoins = DB::table('coni_purchases')
            //     ->where('created_by', $customer->id)
            //     ->sum('coins');

            // if ($totalCoins <= 0) {
            //     return response()->json([
            //         'message' => 'Insufficient coins to deduct',
            //         'available_coins' => $totalCoins,
            //     ], 400);
            // }

            // // Deduct one coin
            // $remainingCoins = $totalCoins - 1;

            // // Update the database records
            // $coinRecords = DB::table('coni_purchases')
            //     ->where('created_by', $customer->id)
            //     ->orderBy('id', 'asc')
            //     ->get();

            // $coinsToDeduct = 1;
            // foreach ($coinRecords as $record) {
            //     if ($coinsToDeduct <= 0) {
            //         break;
            //     }

            //     if ($record->coins > $coinsToDeduct) {
            //         // Partially deduct from this record
            //         DB::table('coni_purchases')
            //             ->where('id', $record->id)
            //             ->update(['coins' => $record->coins - $coinsToDeduct]);
            //         $coinsToDeduct = 0;
            //     } else {
            //         // Fully deduct this record
            //         DB::table('coni_purchases')
            //             ->where('id', $record->id)
            //             ->update(['coins' => 0]);
            //         $coinsToDeduct -= $record->coins;
            //     }
            // }


            // Create the order record
            $order = Order::create([
                'billno' => 'ORD' . time() . rand(100, 999), // Generate a unique bill number
                'gross_total' => $validated['grossTotal'],
                'discount' => $validated['discountTotal'],
                'total_price' => $validated['grossTotal'] - $validated['discountTotal']+$request->totalTax,
                'customer_id' => $validated['customer_id'],
                'created_by' => $customer->id,
                'bill_inv' => $request->bill_inv,
                'salesman_id' => $request->salesman_id,
                'stylist_id' => $request->stylist_id,
                'order_slip' => $request->order_slip,
                'date' => $validated['dateid'],
                'discountPercent'=>$request->discountPercent,
                'discountRs'=>$request->discountRs,
                'additionRS'=>$request->additionRS,
                'additionDetail'=>$request->additionDetail,
                'totalqty'=>$request->totalqty,
                'totalTax'=>$request->totalTax,
                'adjustAmount'=>$request->adjustAmount,
                'advanceAmount'=>$request->advanceAmount,
                'depositeMaterial'=>$request->depositeMaterial,
               

            ]);

            // Store each product in the order details
            foreach ($validated['products'] as $product) {
                $order->details()->create([
                    'product_name' => $product['name'],
                    'product_id'=> $product['product_id'] ?? null,
                    'product_code' => $product['code'],
                    'gross_weight' => $product['grossWeight'],
                    'net_weight' => $product['netWeight'],
                    'making' => $product['making'],
                    'makingInRs'=> $product['makingInRs'],
                    'rate' => $product['rate'],
                    'tax_rate' => $product['tax_rate'],
                    'pro_total' => number_format((float) $product['pro_total'], 2, '.', ''), // Fixing decimal issue
                    'stone_weight' => $product['stoneWeight'] ?? null,
                    'stone_value' => $product['stoneValue'] ?? null,
                    'huid' => $product['huid'] ?? null,
                    'hallmark' => $product['hallmark'] ?? null,
                    'qty' => $product['qty'] ?? null,
                    'hallmarkCharge' => $product['hallmarkCharge'] ?? null,
                    'wastageCharge' => $product['wastageCharge'] ?? null,
                    'hsn' => $product['hsn'] ?? null,
                    'making_dsc' => $product['making_dsc'] ?? null,
                    'metal_value' => $product['metal_value'] ?? null,
                    'otherCharge' => $product['otherCharge'] ?? null,
                    'diamondDetails' => $product['diamondDetails'] ?? null,
                    'diamondValue' => $product['diamondValue'] ?? null,
                    'description'=>$product['description'] ?? null,
                    'making_gst_percentage'=>$product['making_gst_percentage'] ?? null,
                   // 'grm' => $product['grm'] ?? null,
                ]);
            }

            // Store payment details
            foreach ($validated['paymentMethods'] as $paymentData) {
                Payment::create([
               'order_id' => $order->id,
               'customer_id' => $validated['customer_id'],
               'payment_date' => now(),
               'payment_method' => $paymentData['payment_method'],  // payment method (cash, card, upi,other)
               'price' => $paymentData['price'],  // payment amount
                ]);
               }
            // Return a success response
            return response()->json([
                'message' => 'Order placed successfully',
                'order_id' => $order->id,
                'bill_inv' => $order->bill_inv,
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('Validation Error:', ['errors' => $e->errors()]);
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            Log::error('Error in Checkout:', ['message' => $e->getMessage()]);
            return response()->json([
                'message' => 'An error occurred while placing the order',
                'error' => $e->getMessage(),
            ], 500);
        }
    }


    //count the total number of  gerenrted order

    public function OrderCount()
{
    // Authenticate the customer
    $customer = JWTAuth::parseToken()->authenticate();
    Log::info('Authenticated Customer:', ['customer' => $customer]);

    $orders = Order::where('order_slip', 1)
        ->where('created_by', $customer->id)
        ->get();

    return response()->json([
        'success' => true,
        'total' => $orders->count(),
        'data' => $orders,
    ]);
}



//total number or  generated bill
public function BillCount()
{
    // Authenticate the customer
    $customer = JWTAuth::parseToken()->authenticate();
    Log::info('Authenticated Customer:', ['customer' => $customer]);

    $orders = Order::where('order_slip', '!=', 1)
    ->where('created_by', $customer->id)
    ->get();

return response()->json([
    'success' => true,
    'total' => $orders->count(),
    'data' => $orders,
]);
}



//search api for of order table


public function Ordersearch(Request $request)
{
    $request->validate([
        'billno' => 'required|string',
    ]);

    $billno = $request->input('billno');

    $orders = Order::where('order_slip', 1)
                   ->where('billno', 'LIKE', "%{$billno}%")
                   ->get();

    return response()->json([
        'success' => true,
        'data' => $orders,
    ]);
}


    public function getInvoiceIds()
    {
        // Fetch all invoice IDs from the database
        $invoiceIds = Order::pluck('id');

        // Return the IDs as a JSON response
        return response()->json($invoiceIds);
    }





    public function report(Request $request)
    {
        try {
            $format = $request->query('format', 'pdf'); // Default: PDF
            $startDate = $request->query('start_date');
            $endDate = $request->query('end_date');

            // Fetch orders with related data
            $query = Order::with(['details', 'users', 'payments'])
                ->where('order_slip', 1);

            // Apply date filters if provided
            if ($startDate) {
                $query->whereDate('created_at', '>=', $startDate);
            }
            if ($endDate) {
                $query->whereDate('created_at', '<=', $endDate);
            }

            $orders = $query->get();

            if ($orders->isEmpty()) {
                return response()->json(['error' => 'No orders found'], 404);
            }

            if ($format === 'pdf') {
                // Generate PDF
                $html = $this->generateOrderPDFHTML($orders);
                $pdf = Pdf::loadHTML($html);
                return response($pdf->output(), 200, [
                    'Content-Type' => 'application/pdf',
                    'Content-Disposition' => 'attachment; filename="OrderReport.pdf"',
                ]);
            } elseif ($format === 'xlsx') {
                return Excel::download(new OrderReportExport($orders), 'OrderReport.xlsx');
            } else {
                return response()->json(['error' => 'Invalid format'], 400);
            }
        } catch (\Exception $e) {
            Log::error('Report generation failed: ' . $e->getMessage());
            return response()->json(['error' => 'Report generation failed'], 500);
        }
    }

    // Function to generate PDF HTML
    private function generateOrderPDFHTML($orders)
    {
        $html = '
        <html>
        <head>
            <title>Order Report</title>
            <style>
                body { font-family: Arial, sans-serif; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { border: 1px solid black; padding: 8px; text-align: left; }
                th { background-color: #f2f2f2; }
            </style>
        </head>
        <body>
            <h2>Order Report</h2>
            <table>
                <tr>
                    <th>Bill No</th>
                    <th>Gross Total</th>
                    <th>Discount</th>
                    <th>Total Price</th>
                    <th>Customer Name</th>
                    <th>Date</th>
                    <th>Order Details</th>
                </tr>';

        foreach ($orders as $order) {
            $customerName = optional($order->users)->name ?? 'N/A';
            $details = implode(', ', $order->details->pluck('product_name')->toArray());

            $html .= "
                <tr>
                    <td>{$order->billno}</td>
                    <td>{$order->gross_total}</td>
                    <td>{$order->discount}</td>
                    <td>{$order->total_price}</td>
                    <td>{$customerName}</td>
                    <td>{$order->date}</td>
                    <td>{$details}</td>
                </tr>";
        }

        $html .= '
            </table>
        </body>
        </html>';

        return $html;
    }
    public function reportForBill(Request $request)
    {
        try {
            $format = $request->query('format', 'pdf'); // Default format: PDF
            $startDate = $request->query('start_date');
            $endDate = $request->query('end_date');

            // Fetch orders with related data
            $query = Order::with(['details', 'users'])
                ->where('order_slip', 1);

            // Apply date filters if provided
            if ($startDate) {
                $query->whereDate('created_at', '>=', $startDate);
            }
            if ($endDate) {
                $query->whereDate('created_at', '<=', $endDate);
            }

            $orders = $query->get();

            if ($orders->isEmpty()) {
                return response()->json(['error' => 'No orders found'], 404);
            }

            if ($format === 'pdf') {
                // Generate PDF
                $html = $this->generateOrderPDFHTMLBill($orders);
                $pdf = Pdf::loadHTML($html);
                return response($pdf->output(), 200, [
                    'Content-Type' => 'application/pdf',
                    'Content-Disposition' => 'attachment; filename="PurchaseBillReport.pdf"',
                ]);
            } elseif ($format === 'xlsx') {
                return Excel::download(new PurchaseBillExport(), 'PurchaseBillReport.xlsx');
            } else {
                return response()->json(['error' => 'Invalid format'], 400);
            }
        } catch (\Exception $e) {
            Log::error('Report generation failed: ' . $e->getMessage());
            return response()->json(['error' => 'Report generation failed'], 500);
        }
    }

    // Function to generate PDF HTML
    private function generateOrderPDFHTMLBill($orders)
    {
        $html = '
        <html>
        <head>
            <title>Purchase Bill Report</title>
            <style>
                body { font-family: Arial, sans-serif; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { border: 1px solid black; padding: 8px; text-align: left; }
                th { background-color: #f2f2f2; }
            </style>
        </head>
        <body>
            <h2>Purchase Bill Report</h2>
            <table>
                <tr>
                    <th>Bill No</th>
                    <th>Gross Total</th>
                    <th>Discount</th>
                    <th>Total Price</th>
                    <th>Customer Name</th>
                    <th>Date</th>
                    <th>Order Details</th>
                </tr>';

        foreach ($orders as $order) {
            $customerName = optional($order->users)->name ?? 'N/A';
            $details = implode(', ', $order->details->pluck('product_name')->toArray());

            $html .= "
                <tr>
                    <td>{$order->billno}</td>
                    <td>{$order->gross_total}</td>
                    <td>{$order->discount}</td>
                    <td>{$order->total_price}</td>
                    <td>{$customerName}</td>
                    <td>{$order->date}</td>
                    <td>{$details}</td>
                </tr>";
        }

        $html .= '
            </table>
        </body>
        </html>';

        return $html;
    }

    public function reportForProductWise(Request $request)
    {
        try {
            $format = $request->query('format', 'pdf');
            $startDate = $request->query('start_date');
            $endDate = $request->query('end_date');

            // Fetch orders directly
            $query = \App\Models\Order::where('order_slip', 1);

            // Apply date filters if provided
            if ($startDate) {
                $query->whereDate('created_at', '>=', $startDate);
            }
            if ($endDate) {
                $query->whereDate('created_at', '<=', $endDate);
            }

            $orders = $query->get(); // Only fetching orders now, no 'details' or 'product' relations

            if ($orders->isEmpty()) {
                return response()->json(['error' => 'No product-wise purchases found'], 404);
            }

            if ($format === 'pdf') {
                $html = $this->generateProductWisePDF($orders);
                $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadHTML($html);
                return response($pdf->output(), 200, [
                    'Content-Type' => 'application/pdf',
                    'Content-Disposition' => 'attachment; filename="ProductWisePurchaseReport.pdf"',
                ]);
            } elseif ($format === 'xlsx') {
                return \Maatwebsite\Excel\Facades\Excel::download(new \App\Exports\ProductWisePurchaseExport(), 'ProductWisePurchaseReport.xlsx');
            } else {
                return response()->json(['orders' => $orders]);
            }
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Product-wise report generation failed: ' . $e->getMessage());
            return response()->json(['error' => 'Report generation failed'], 500);
        }
    }



    // Function to calculate gross total, discount, and total price
    private function calculateOrderTotals($details)
    {
        $grossTotal = 0;
        $discount = 0;
        $totalPrice = 0;

        foreach ($details as $detail) {
            $order = $detail->order;
            if ($order) {
                $grossTotal += (float) $order->gross_total;
                $discount += (float) $order->discount;
                $totalPrice += (float) $order->total_price;
            }
        }

        return [
            'gross_total' => number_format($grossTotal, 2),
            'discount' => number_format($discount, 2),
            'total_price' => number_format($totalPrice, 2),
        ];
    }

    // Function to generate PDF with totals
    private function generateProductWisePDF($details, $totals)
    {
        $html = '
        <html>
        <head>
            <title>Product-Wise Purchase Report</title>
            <style>
                body { font-family: Arial, sans-serif; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { border: 1px solid black; padding: 8px; text-align: left; }
                th { background-color: #f2f2f2; }
                .totals { font-weight: bold; margin-top: 20px; }
            </style>
        </head>
        <body>
            <h2>Product-Wise Purchase Report</h2>
            <table>
                <tr>
                    <th>Product Name</th>
                    <th>Bill No</th>
                    <th>Quantity</th>
                    <th>Unit Price</th>
                    <th>Total Price</th>
                    <th>Customer Name</th>
                    <th>Purchase Date</th>
                </tr>';

        foreach ($details as $detail) {
            $productName = optional($detail->product)->name ?? 'N/A';
            $billNo = optional($detail->order)->billno ?? 'N/A';
            $customerName = optional($detail->order->users)->name ?? 'N/A';
            $date = optional($detail->order)->date ?? 'N/A';
            $totalPrice = $detail->quantity * $detail->unit_price;

            $html .= "
                <tr>
                    <td>{$productName}</td>
                    <td>{$billNo}</td>
                    <td>{$detail->quantity}</td>
                    <td>{$detail->unit_price}</td>
                    <td>{$totalPrice}</td>
                    <td>{$customerName}</td>
                    <td>{$date}</td>
                </tr>";
        }

        // Append totals
        $html .= '
            </table>
            <div class="totals">
                <p>Gross Total: ' . $totals['gross_total'] . '</p>
                <p>Discount: ' . $totals['discount'] . '</p>
                <p>Total Price: ' . $totals['total_price'] . '</p>
            </div>
        </body>
        </html>';

        return $html;
    }


    // public function stockDetails()
    // {
    //     $customer = JWTAuth::parseToken()->authenticate();
    //     return ProductService::join('rate_masters', 'rate_masters.id', '=', 'product_services.rate_id')
    //     ->join('stocks', 'product_services.id', '=', 'stocks.product_service_id')
    //     ->leftJoinSub(
    //         \DB::table('order_details')
    //             ->select('product_id', \DB::raw('SUM(qty) as total_ordered_quantity'))
    //             ->groupBy('product_id'),
    //         'orders',
    //         'product_services.id',
    //         '=',
    //         'orders.product_id'
    //     ) // Subquery to get total ordered quantity per product
    //     ->select(
    //         'product_services.id',
    //         'product_services.name',
    //         'product_services.image',
    //         'rate_masters.rate',
    //         'product_services.code',
    //         'product_services.type',
    //         'product_services.tax_rate',
    //         'product_services.hsn',
    //         'product_services.brand',
    //         'product_services.description',
    //         'product_services.pro_ser_type',
    //         'product_services.expires',
    //         \DB::raw('SUM(stocks.quantity) as total_quantity'),
    //         \DB::raw('COALESCE(orders.total_ordered_quantity, 0) as total_ordered_quantity'),
    //         \DB::raw('SUM(stocks.quantity) - COALESCE(orders.total_ordered_quantity, 0) as available_quantity')
    //     )
    //     ->where('product_services.created_by', $customer->id)
    //     ->groupBy(
    //         'product_services.id',
    //         'product_services.name',
    //         'product_services.image',
    //         'rate_masters.rate',
    //         'product_services.code',
    //         'product_services.type',
    //         'product_services.tax_rate',
    //         'product_services.hsn',
    //         'product_services.brand',
    //         'product_services.description',
    //         'product_services.pro_ser_type',
    //         'product_services.expires',
    //         'orders.total_ordered_quantity'
    //     )
    //     ->get();


    // }

    // public function stockDetails()
    // {
    //     // $customer = JWTAuth::parseToken()->authenticate();
    //     $totalPcs = PurchaseItem::sum('pcs');
    //     return ProductService::join('rate_masters', 'rate_masters.id', '=', 'product_services.rate_id')
    //     ->join('stocks', 'product_services.id', '=', 'stocks.product_service_id')
    //     ->leftJoinSub(
    //         \DB::table('order_details')
    //             ->select('product_id', \DB::raw('SUM(qty) as total_ordered_quantity'))
    //             ->groupBy('product_id'),
    //         'orders',
    //         'product_services.id',
    //         '=',
    //         'orders.product_id'
    //     ) // Subquery to get total ordered quantity per product
    //     ->select(
    //         'product_services.id',
    //         'product_services.name',
    //         'product_services.image',
    //         'rate_masters.rate',
    //         'product_services.code',
    //         'product_services.type',
    //         'product_services.tax_rate',
    //         'product_services.hsn',
    //         'product_services.brand',
    //         'product_services.description',
    //         'product_services.pro_ser_type',
    //         'product_services.expires',
    //         \DB::raw('SUM(stocks.quantity) as total_quantity'),
    //         \DB::raw('COALESCE(orders.total_ordered_quantity, 0) as total_ordered_quantity'),
    //         \DB::raw('SUM(stocks.quantity) - COALESCE(orders.total_ordered_quantity, 0) as available_quantity')
    //     )
    //     // ->where('product_services.created_by', $customer->id)
    //     ->groupBy(
    //         'product_services.id',
    //         'product_services.name',
    //         'product_services.image',
    //         'rate_masters.rate',
    //         'product_services.code',
    //         'product_services.type',
    //         'product_services.tax_rate',
    //         'product_services.hsn',
    //         'product_services.brand',
    //         'product_services.description',
    //         'product_services.pro_ser_type',
    //         'product_services.expires',
    //         'orders.total_ordered_quantity'
    //     )
    //     ->get();


    // }
//     public function stockDetails()
// {
//     // Optional: Get authenticated user
//     // $customer = JWTAuth::parseToken()->authenticate();

//     // Subquery: total ordered quantity
//     $orderSub = \DB::table('order_details')
//         ->select('product_id', \DB::raw('SUM(qty) as total_ordered_quantity'))
//         ->groupBy('product_id');

//     // Subquery: total purchased pcs
//     $purchaseSub = \DB::table('purchase_items')
//         ->select('product_service_id', \DB::raw('SUM(pcs) as total_purchased_pcs'))
//         ->groupBy('product_service_id');

//     return ProductService::join('rate_masters', 'rate_masters.id', '=', 'product_services.rate_id')
//         ->join('stocks', 'product_services.id', '=', 'stocks.product_service_id')
//         ->leftJoinSub($orderSub, 'orders', 'product_services.id', '=', 'orders.product_id')
//         ->leftJoinSub($purchaseSub, 'purchases', 'product_services.id', '=', 'purchases.product_service_id')
//         ->select(
//             'product_services.id',
//             'product_services.name',
//             'product_services.image',
//             'rate_masters.rate',
//             'product_services.code',
//             'product_services.type',
//             'product_services.tax_rate',
//             'product_services.hsn',
//             'product_services.brand',
//             'product_services.description',
//             'product_services.pro_ser_type',
//             'product_services.expires',
//             \DB::raw('SUM(stocks.quantity) as total_quantity'),
//             \DB::raw('COALESCE(orders.total_ordered_quantity, 0) as total_ordered_quantity'),
//             \DB::raw('COALESCE(purchases.total_purchased_pcs, 0) as total_purchased_pcs'),
//             \DB::raw('SUM(stocks.quantity) - COALESCE(orders.total_ordered_quantity, 0) as available_quantity')
//         )
//         // ->where('product_services.created_by', $customer->id)
//         ->groupBy(
//             'product_services.id',
//             'product_services.name',
//             'product_services.image',
//             'rate_masters.rate',
//             'product_services.code',
//             'product_services.type',
//             'product_services.tax_rate',
//             'product_services.hsn',
//             'product_services.brand',
//             'product_services.description',
//             'product_services.pro_ser_type',
//             'product_services.expires',
//             'orders.total_ordered_quantity',
//             'purchases.total_purchased_pcs'
//         )
//         ->get();
// }


public function stockDetails()
{
    // Optional: Authenticated user
    $customer = JWTAuth::parseToken()->authenticate();

    // Subquery for total ordered quantity
    $orderSub = \DB::table('order_details')
        ->select('product_id', \DB::raw('SUM(qty) as total_ordered_quantity'))
        ->groupBy('product_id');

    // Subquery for total purchased pcs
    $purchaseSub = \DB::table('purchase_items')
        ->select('product_service_id', \DB::raw('SUM(pcs) as total_purchased_pcs'))
        ->groupBy('product_service_id');

    return ProductService::join('rate_masters', 'rate_masters.id', '=', 'product_services.rate_id')
        ->join('stocks', 'product_services.id', '=', 'stocks.product_service_id')
        ->leftJoinSub($orderSub, 'orders', 'product_services.id', '=', 'orders.product_id')
        ->leftJoinSub($purchaseSub, 'purchases', 'product_services.id', '=', 'purchases.product_service_id')
        ->select(
            'product_services.id',
            'product_services.group_id',
            'product_services.name',
            'product_services.image',
            'rate_masters.rate',
            'product_services.code',
            'product_services.type',
            'product_services.tax_rate',
            'product_services.hsn',
            'product_services.brand',
            'product_services.description',
            'product_services.pro_ser_type',
            'product_services.expires',
            \DB::raw('SUM(stocks.quantity) as stock_quantity'),
            \DB::raw('COALESCE(purchases.total_purchased_pcs, 0) as total_purchased_pcs'),
            \DB::raw('COALESCE(orders.total_ordered_quantity, 0) as total_ordered_quantity'),
            // Add stock + purchased_pcs
            \DB::raw('(SUM(stocks.quantity) + COALESCE(purchases.total_purchased_pcs, 0)) as total_quantity'),
            \DB::raw('(SUM(stocks.quantity) + COALESCE(purchases.total_purchased_pcs, 0)) - COALESCE(orders.total_ordered_quantity, 0) as available_quantity')
        )
        ->where('product_services.created_by', $customer->id)
        ->groupBy(
            'product_services.id',
            'product_services.name',
            'product_services.image',
            'product_services.group_id',
            'rate_masters.rate',
            'product_services.code',
            'product_services.type',
            'product_services.tax_rate',
            'product_services.hsn',
            'product_services.brand',
            'product_services.description',
            'product_services.pro_ser_type',
            'product_services.expires',
            'orders.total_ordered_quantity',
            'purchases.total_purchased_pcs'
        )
        ->get();
}




//     public function stockDetails()
// {
//     // $customer = JWTAuth::parseToken()->authenticate();
//     // $totalPcs = PurchaseItem::sum('pcs');
//     return ProductService::join('rate_masters', 'rate_masters.id', '=', 'product_services.rate_id')
//         ->join('stocks', 'product_services.id', '=', 'stocks.product_service_id')

//         ->leftJoinSub(
//             \DB::table('order_details')
//                 ->select('product_id', \DB::raw('SUM(qty) as total_ordered_quantity'))
//                 ->groupBy('product_id'),
//             'orders',
//             'product_services.id',
//             '=',
//             'orders.product_id'
//         )
//         ->select(
//             'product_services.id',
//             'product_services.name',
//             'product_services.image',
//             'rate_masters.rate',
//             'product_services.code',
//             'product_services.type',
//             'product_services.tax_rate',
//             'product_services.hsn',
//             'product_services.brand',
//             'product_services.description',
//             'product_services.pro_ser_type',
//             'product_services.expires',
//             \DB::raw('SUM(stocks.quantity) as total_quantity'),
//             \DB::raw('COALESCE(orders.total_ordered_quantity, 0) as total_ordered_quantity'),
//             \DB::raw('SUM(stocks.quantity) - COALESCE(orders.total_ordered_quantity, 0) as available_quantity'),
//         )
//         // ->where('product_services.created_by', $customer->id)
//         ->groupBy(
//             'product_services.id',
//             'product_services.name',
//             'product_services.image',
//             'rate_masters.rate',
//             'product_services.code',
//             'product_services.type',
//             'product_services.tax_rate',
//             'product_services.hsn',
//             'product_services.brand',
//             'product_services.description',
//             'product_services.pro_ser_type',
//             'product_services.expires',

//         )
//         ->get();
// }

    //today devlivary on base of created date on orders
    public function todayOrderCount()
{
    $customer = JWTAuth::parseToken()->authenticate();
    $todayOrderCount = Order::whereDate('created_at', Carbon::today())
    ->where('created_by',$customer->id)

    ->count();

    return response()->json([
        'today_order_count' => $todayOrderCount
    ]);
}




}


