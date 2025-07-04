<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Coin;
use App\Models\SaloonOrder;
use App\Models\ProductService;
use App\Models\SaloonPayment;
 use Barryvdh\DomPDF\Facade\Pdf;
use App\Exports\OrderReportExport;
use Illuminate\Support\Facades\DB;
use Tymon\JWTAuth\Facades\JWTAuth;

use App\Exports\PurchaseBillExport;
use Illuminate\Support\Facades\Log;
 use Maatwebsite\Excel\Facades\Excel;
use App\Exports\ProductWisePurchaseExport;


class SaloonOrderController extends Controller
{
    //
    public function storeCheckout(Request $request)
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
                'products.*.qty' => 'nullable',
                'products.*.tax_rate' => 'nullable',

                'products.*.rate' => 'nullable',
                 'grossTotal' => 'nullable',
                'discountTotal' => 'nullable',
                'dateid' => 'nullable',
                'customer_id' => 'required|',
                'price' => 'nullable',
               // 'tax_rate'=> 'nullable',
                'products.*pro_total' => 'required|array',
                'products.*.hsn' => 'nullable',
                'printStatus_id' => 'nullable',
                'membDiscount' => 'nullable',
                // 'usingLoyaltyPoints'  => 'nullable'
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

            // Deduct one coin
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
            $order = SaloonOrder::create([
                'billno' => 'SL' . time() . rand(100, 999), // Generate a unique bill number
                'gross_total' => $validated['grossTotal'],
                'discount' => $validated['discountTotal'],
                'total_price' => $validated['grossTotal'] - $validated['discountTotal'],
                'customer_id' => $validated['customer_id'],
                'created_by' => $customer->id,
                'bill_inv' => $request->bill_inv,
                'salesman_id' => $request->salesman_id,
                'stylist_id' => $request->stylist_id,
                'printStatus_id' => $validated['printStatus_id'],
                'date' => $validated['dateid'],
                'membDiscount' => $validated['membDiscount'],
                'totaltax'=>$request->totaltax,
                'totalDiscount'=>$request->totalDiscount
                // 'usingLoyaltyPoints' => $validated['usingLoyaltyPoints'],
            ]);
           // Update last_order_at for the customer
            DB::table('customers')
           ->where('user_id', $validated['customer_id'])
           ->update(['last_order_at' => now()]);

            // Store each product in the order details
            foreach ($validated['products'] as $product) {

                  // 1. Find the product service entry by product_id
    $productService = ProductService::find($product['product_id']);

    // 2. If found, subtract qty and update the current_stock
    if ($productService) {
        $newStock = $productService->current_stock - $product['qty'];

        // Prevent stock from going below 0
        $productService->current_stock = max(0, $newStock);
        $productService->save();
    } else {
        Log::warning('ProductService not found for product_id: ' . $product['product_id']);
    }



                $order->saloonDetails()->create([
                    'product_name' => $product['name'],
                    'product_code' => $product['code'],
                    'qty' => $product['qty'],
                    'rate' => $product['rate'],

                    'tax_rate' => $product['tax_rate'],
                    'pro_total' => number_format((float) $product['pro_total'], 2, '.', ''), // Fixing decimal issue
                    'hsn' => $product['hsn'],
                    'product_id'=>$product['product_id']


                ]);
            }


            // Loop through the payment methods and store each one
           foreach ($validated['paymentMethods'] as $paymentData) {
          SaloonPayment::create([
         'order_id' => $order->id,
         'customer_id' => $validated['customer_id'],
         'payment_date' => now(),
         'payment_method' => $paymentData['payment_method'],  // payment method (cash, card, upi)
         'price' => $paymentData['price'],  // payment amount
          ]);
         }



//          if (!empty($request->payments) && is_array($request->payments)) {
//     foreach ($request->payments as $paymentData) {
//         // Store each payment method (cash, card, upi, etc.)
//         Payment::create([
//             'order_id' => $request->order_id,
//             'customer_id' => $request->customer_id,
//             'payment_date' => $request->payment_date,
//             'payment_method' => $paymentData['payment_method'],
//             'price' => $paymentData['price'],
//         ]);
//     }
// } else {
//     Log::error('Payments data is missing or invalid', ['payments' => $request->payments]);
//     return response()->json([
//         'message' => 'Payments data is missing or invalid',
//     ], 400);
// }


            // // Store payment details
            // Payment::create([
            //     'order_id' => $order->id,
            //     'customer_id' => $validated['customer_id'],
            //     'price' => $validated['price'],
            //     'payment_date' => now(),
            //     'payment_method' => $validated['paymentMethod'],
            // ]);

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


    public function generateNextBillNo()
    {
        // Get authenticated user
        $user = JWTAuth::parseToken()->authenticate();

        // Check if user exists
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        // Extract first and last name initials from the full name
        $nameParts = explode(" ", trim($user->name));
        $firstLetter = strtoupper(substr($nameParts[0] ?? '', 0, 1)); // First letter of first word
        $lastLetter = strtoupper(substr(end($nameParts) ?? '', 0, 1)); // Last letter of last word

        // Get the last inserted ID from the orders table
        $lastId = DB::table('saloon_orders')->max('id') ?? 0; // Default to 0 if no records exist

        // Increment ID for the next bill number
        $nextBillId = $lastId + 1;

        // Get today's full date (e.g., "2025-02-15")
        $dateSuffix = now()->format('Y-m-d'); // Full date format

        // Generate the new bill number in the format: BN{ID}-{YYYY-MM-DD}
        $newBillNo = "BN{$nextBillId}-{$dateSuffix}";

        // Debugging: Log the generated bill number
        \Log::info("Last ID: $lastId | Next Bill No: $newBillNo");

        return $newBillNo;
    }





    public function printdata($id)
    {
        // Retrieve the order and its related details
        $invoice = SaloonOrder::with(['saloonDetails', 'users', 'users.customers', 'saloonPayments'])->findOrFail($id);

        // Calculate total payment and due payment
        $totalPayment = $invoice->saloonPayments->sum('price');
        $duePayment = $invoice->total_price - $totalPayment;

        // Append the calculated values to the response
        $invoiceData = $invoice->toArray();
        $invoiceData['total_payment'] = $totalPayment;
        $invoiceData['due_payment'] = $duePayment;

        return response()->json($invoiceData);
    }



    //get all orders-saloon
    public function getDailyCashReportsSalooon()
{
    try {
        // Get authenticated user
        $user = JWTAuth::parseToken()->authenticate();

        // Fetch saloon_orders where created_by = authenticated user's id
        $orders = SaloonOrder::with('users')
        ->where('created_by', $user->id)
        ->get();
        return response()->json([
            'status' => true,
            'message' => 'Saloon orders fetched successfully.',
            'data' => $orders
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'status' => false,
            'message' => 'Failed to fetch saloon orders.',
            'error' => $e->getMessage()
        ], 500);
    }
}


    // public function printdata($id)
    // {
    //     // Retrieve the order and its related details (assuming you want order and products related to the invoice)
    //     $invoice = Order::with(['details','users','users.customers'])->findOrFail($id);

    //     // Return the invoice data as JSON
    //     return response()->json($invoice);
    // }

    // public function orderslipdata(Request $request)
    // {
    //     // Retrieve query parameters
    //     $startDate = $request->query('start_date');
    //     $endDate = $request->query('end_date');

    //     // Build the query
    //     $query = Order::with(['details', 'users', 'users.customers', 'payments'])
    //         ->where('order_slip', 1);

    //     // Apply date filters if provided
    //     if ($startDate) {
    //         $query->whereDate('created_at', '>=', $startDate);
    //     }

    //     if ($endDate) {
    //         $query->whereDate('created_at', '<=', $endDate);
    //     }

    //     // Execute the query and get results
    //     $orders = $query->get();

    //     // Return the response as JSON
    //     return response()->json($orders);
    // }


    // public function partialOrderData(Request $request)
    // {
    //     // Authenticate the customer
    //     $customer = JWTAuth::parseToken()->authenticate();
    //     Log::info('Authenticated Customer:', ['customer' => $customer]);

    //     // Build the query with the necessary relationships
    //     $orders = Order::with(['details', 'users', 'users.customers', 'payments'])
    //         ->where('created_by', $customer->id)
    //         ->whereNull('bill_inv') // Filter orders where bill_inv is NULL

    //         ->get()
    //         ->map(function ($order) {
    //             // Calculate total payments for the order
    //             $totalPayment = $order->payments->sum('price'); // Sum all payments

    //             // Calculate the due amount
    //             $duePayment = $order->total_price - $totalPayment;

    //             // Add calculated fields to the order
    //             $order->total_payment = $totalPayment;
    //             $order->due_payment = $duePayment;

    //             return $order;
    //         });

    //     return response()->json([
    //         'message' => 'Successfully fetched partial order data',
    //         'data' => $orders,
    //     ], 200);
    // }


    // public function storePartialOrderData(Request $request)
    // {
    //     // Validate the request
    //     $validatedData = $request->validate([
    //         'order_id' => 'required|integer',
    //         'customer_id' => 'required|integer',
    //         'payment_date' => 'required|date',
    //         'payment_method' => 'required|string',
    //         'price' => 'required|numeric',
    //     ]);

    //     try {
    //         // Save payment data to the database
    //         $payment = new Payment();
    //         $payment->order_id = $validatedData['order_id'];
    //         $payment->customer_id = $validatedData['customer_id'];
    //         $payment->payment_date = $validatedData['payment_date'];
    //         $payment->payment_method = $validatedData['payment_method'];
    //         $payment->price = $validatedData['price'];
    //         $payment->save();

    //         return response()->json([
    //             'success' => true,
    //             'message' => 'Payment data saved successfully!',
    //         ], 201);
    //     } catch (\Exception $e) {
    //         return response()->json([
    //             'success' => false,
    //             'message' => 'Failed to save payment data.',
    //             'error' => $e->getMessage(),
    //         ], 500);
    //     }
    // }


    // public function OrderSlip(Request $request)
    // {
    //     try {
    //         // Authenticate the customer
    //         $customer = JWTAuth::parseToken()->authenticate();
    //         Log::info('Authenticated Customer:', ['customer' => $customer]);

    //         // Validate incoming request data
    //         $validated = $request->validate([
    //             'paymentMethod' => 'required|string',
    //             'products' => 'required|array|min:1',
    //             'products.*.name' => 'required|string',
    //             'products.*.code' => 'required|string',
    //             'products.*.stoneWeight' => 'nullable|numeric',
    //             'products.*.stoneValue' => 'nullable|numeric',
    //             'products.*.huid' => 'nullable|string',
    //             'products.*.hallmark' => 'nullable|string',
    //             'products.*.grossWeight' => 'required|numeric',
    //             'products.*.netWeight' => 'required|numeric',
    //             'products.*.making' => 'required|numeric',
    //             'products.*.rate' => 'required|numeric',
    //             'products.*.metal_value' => 'required',
    //             'products.*.making_dsc' => 'required',
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
    //             'billno' => 'ORD' . time() . rand(100, 999), // Generate a unique bill number
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

    // public function getInvoiceIds()
    // {
    //     // Fetch all invoice IDs from the database
    //     $invoiceIds = Order::pluck('id');

    //     // Return the IDs as a JSON response
    //     return response()->json($invoiceIds);
    // }





    // public function report(Request $request)
    // {
    //     try {
    //         $format = $request->query('format', 'pdf'); // Default: PDF
    //         $startDate = $request->query('start_date');
    //         $endDate = $request->query('end_date');

    //         // Fetch orders with related data
    //         $query = Order::with(['details', 'users', 'payments'])
    //             ->where('order_slip', 1);

    //         // Apply date filters if provided
    //         if ($startDate) {
    //             $query->whereDate('created_at', '>=', $startDate);
    //         }
    //         if ($endDate) {
    //             $query->whereDate('created_at', '<=', $endDate);
    //         }

    //         $orders = $query->get();

    //         if ($orders->isEmpty()) {
    //             return response()->json(['error' => 'No orders found'], 404);
    //         }

    //         if ($format === 'pdf') {
    //             // Generate PDF
    //             $html = $this->generateOrderPDFHTML($orders);
    //             $pdf = Pdf::loadHTML($html);
    //             return response($pdf->output(), 200, [
    //                 'Content-Type' => 'application/pdf',
    //                 'Content-Disposition' => 'attachment; filename="OrderReport.pdf"',
    //             ]);
    //         } elseif ($format === 'xlsx') {
    //             return Excel::download(new OrderReportExport($orders), 'OrderReport.xlsx');
    //         } else {
    //             return response()->json(['error' => 'Invalid format'], 400);
    //         }
    //     } catch (\Exception $e) {
    //         Log::error('Report generation failed: ' . $e->getMessage());
    //         return response()->json(['error' => 'Report generation failed'], 500);
    //     }
    // }

    // Function to generate PDF HTML
    // private function generateOrderPDFHTML($orders)
    // {
    //     $html = '
    //     <html>
    //     <head>
    //         <title>Order Report</title>
    //         <style>
    //             body { font-family: Arial, sans-serif; }
    //             table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    //             th, td { border: 1px solid black; padding: 8px; text-align: left; }
    //             th { background-color: #f2f2f2; }
    //         </style>
    //     </head>
    //     <body>
    //         <h2>Order Report</h2>
    //         <table>
    //             <tr>
    //                 <th>Bill No</th>
    //                 <th>Gross Total</th>
    //                 <th>Discount</th>
    //                 <th>Total Price</th>
    //                 <th>Customer Name</th>
    //                 <th>Date</th>
    //                 <th>Order Details</th>
    //             </tr>';

    //     foreach ($orders as $order) {
    //         $customerName = optional($order->users)->name ?? 'N/A';
    //         $details = implode(', ', $order->details->pluck('product_name')->toArray());

    //         $html .= "
    //             <tr>
    //                 <td>{$order->billno}</td>
    //                 <td>{$order->gross_total}</td>
    //                 <td>{$order->discount}</td>
    //                 <td>{$order->total_price}</td>
    //                 <td>{$customerName}</td>
    //                 <td>{$order->date}</td>
    //                 <td>{$details}</td>
    //             </tr>";
    //     }

    //     $html .= '
    //         </table>
    //     </body>
    //     </html>';

    //     return $html;
    // }
    // public function reportForBill(Request $request)
    // {
    //     try {
    //         $format = $request->query('format', 'pdf'); // Default format: PDF
    //         $startDate = $request->query('start_date');
    //         $endDate = $request->query('end_date');

    //         // Fetch orders with related data
    //         $query = Order::with(['details', 'users'])
    //             ->where('order_slip', 1);

    //         // Apply date filters if provided
    //         if ($startDate) {
    //             $query->whereDate('created_at', '>=', $startDate);
    //         }
    //         if ($endDate) {
    //             $query->whereDate('created_at', '<=', $endDate);
    //         }

    //         $orders = $query->get();

    //         if ($orders->isEmpty()) {
    //             return response()->json(['error' => 'No orders found'], 404);
    //         }

    //         if ($format === 'pdf') {
    //             // Generate PDF
    //             $html = $this->generateOrderPDFHTMLBill($orders);
    //             $pdf = Pdf::loadHTML($html);
    //             return response($pdf->output(), 200, [
    //                 'Content-Type' => 'application/pdf',
    //                 'Content-Disposition' => 'attachment; filename="PurchaseBillReport.pdf"',
    //             ]);
    //         } elseif ($format === 'xlsx') {
    //             return Excel::download(new PurchaseBillExport(), 'PurchaseBillReport.xlsx');
    //         } else {
    //             return response()->json(['error' => 'Invalid format'], 400);
    //         }
    //     } catch (\Exception $e) {
    //         Log::error('Report generation failed: ' . $e->getMessage());
    //         return response()->json(['error' => 'Report generation failed'], 500);
    //     }
    // }

    // // Function to generate PDF HTML
    // private function generateOrderPDFHTMLBill($orders)
    // {
    //     $html = '
    //     <html>
    //     <head>
    //         <title>Purchase Bill Report</title>
    //         <style>
    //             body { font-family: Arial, sans-serif; }
    //             table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    //             th, td { border: 1px solid black; padding: 8px; text-align: left; }
    //             th { background-color: #f2f2f2; }
    //         </style>
    //     </head>
    //     <body>
    //         <h2>Purchase Bill Report</h2>
    //         <table>
    //             <tr>
    //                 <th>Bill No</th>
    //                 <th>Gross Total</th>
    //                 <th>Discount</th>
    //                 <th>Total Price</th>
    //                 <th>Customer Name</th>
    //                 <th>Date</th>
    //                 <th>Order Details</th>
    //             </tr>';

    //     foreach ($orders as $order) {
    //         $customerName = optional($order->users)->name ?? 'N/A';
    //         $details = implode(', ', $order->details->pluck('product_name')->toArray());

    //         $html .= "
    //             <tr>
    //                 <td>{$order->billno}</td>
    //                 <td>{$order->gross_total}</td>
    //                 <td>{$order->discount}</td>
    //                 <td>{$order->total_price}</td>
    //                 <td>{$customerName}</td>
    //                 <td>{$order->date}</td>
    //                 <td>{$details}</td>
    //             </tr>";
    //     }

    //     $html .= '
    //         </table>
    //     </body>
    //     </html>';

    //     return $html;
    // }

    // public function reportForProductWise(Request $request)
    // {
    //     try {
    //         $format = $request->query('format', 'pdf');
    //         $startDate = $request->query('start_date');
    //         $endDate = $request->query('end_date');

    //         // Fetch orders directly
    //         $query = \App\Models\Order::where('order_slip', 1);

    //         // Apply date filters if provided
    //         if ($startDate) {
    //             $query->whereDate('created_at', '>=', $startDate);
    //         }
    //         if ($endDate) {
    //             $query->whereDate('created_at', '<=', $endDate);
    //         }

    //         $orders = $query->get(); // Only fetching orders now, no 'details' or 'product' relations

    //         if ($orders->isEmpty()) {
    //             return response()->json(['error' => 'No product-wise purchases found'], 404);
    //         }

    //         if ($format === 'pdf') {
    //             $html = $this->generateProductWisePDF($orders);
    //             $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadHTML($html);
    //             return response($pdf->output(), 200, [
    //                 'Content-Type' => 'application/pdf',
    //                 'Content-Disposition' => 'attachment; filename="ProductWisePurchaseReport.pdf"',
    //             ]);
    //         } elseif ($format === 'xlsx') {
    //             return \Maatwebsite\Excel\Facades\Excel::download(new \App\Exports\ProductWisePurchaseExport(), 'ProductWisePurchaseReport.xlsx');
    //         } else {
    //             return response()->json(['orders' => $orders]);
    //         }
    //     } catch (\Exception $e) {
    //         \Illuminate\Support\Facades\Log::error('Product-wise report generation failed: ' . $e->getMessage());
    //         return response()->json(['error' => 'Report generation failed'], 500);
    //     }
    // }



    // Function to calculate gross total, discount, and total price
    // private function calculateOrderTotals($details)
    // {
    //     $grossTotal = 0;
    //     $discount = 0;
    //     $totalPrice = 0;

    //     foreach ($details as $detail) {
    //         $order = $detail->order;
    //         if ($order) {
    //             $grossTotal += (float) $order->gross_total;
    //             $discount += (float) $order->discount;
    //             $totalPrice += (float) $order->total_price;
    //         }
    //     }

    //     return [
    //         'gross_total' => number_format($grossTotal, 2),
    //         'discount' => number_format($discount, 2),
    //         'total_price' => number_format($totalPrice, 2),
    //     ];
    // }

    // Function to generate PDF with totals
    // private function generateProductWisePDF($details, $totals)
    // {
    //     $html = '
    //     <html>
    //     <head>
    //         <title>Product-Wise Purchase Report</title>
    //         <style>
    //             body { font-family: Arial, sans-serif; }
    //             table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    //             th, td { border: 1px solid black; padding: 8px; text-align: left; }
    //             th { background-color: #f2f2f2; }
    //             .totals { font-weight: bold; margin-top: 20px; }
    //         </style>
    //     </head>
    //     <body>
    //         <h2>Product-Wise Purchase Report</h2>
    //         <table>
    //             <tr>
    //                 <th>Product Name</th>
    //                 <th>Bill No</th>
    //                 <th>Quantity</th>
    //                 <th>Unit Price</th>
    //                 <th>Total Price</th>
    //                 <th>Customer Name</th>
    //                 <th>Purchase Date</th>
    //             </tr>';

    //     foreach ($details as $detail) {
    //         $productName = optional($detail->product)->name ?? 'N/A';
    //         $billNo = optional($detail->order)->billno ?? 'N/A';
    //         $customerName = optional($detail->order->users)->name ?? 'N/A';
    //         $date = optional($detail->order)->date ?? 'N/A';
    //         $totalPrice = $detail->quantity * $detail->unit_price;

    //         $html .= "
    //             <tr>
    //                 <td>{$productName}</td>
    //                 <td>{$billNo}</td>
    //                 <td>{$detail->quantity}</td>
    //                 <td>{$detail->unit_price}</td>
    //                 <td>{$totalPrice}</td>
    //                 <td>{$customerName}</td>
    //                 <td>{$date}</td>
    //             </tr>";
    //     }

    //     // Append totals
    //     $html .= '
    //         </table>
    //         <div class="totals">
    //             <p>Gross Total: ' . $totals['gross_total'] . '</p>
    //             <p>Discount: ' . $totals['discount'] . '</p>
    //             <p>Total Price: ' . $totals['total_price'] . '</p>
    //         </div>
    //     </body>
    //     </html>';

    //     return $html;
    // }






}
