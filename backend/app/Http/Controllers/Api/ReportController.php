<?php

namespace App\Http\Controllers\Api;


use App\Models\Order;
use App\Models\Barcode;
use App\Models\Payment;
use App\Models\Purchase;
use App\Models\AssignClient;
use Illuminate\Http\Request;
use App\Models\SoftwareCommission;
use Illuminate\Support\Facades\DB;
use Tymon\JWTAuth\Facades\JWTAuth;
use App\Models\BarcodePrintHistory;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Carbon\Carbon;
use App\Models\SaloonPayment;

class ReportController extends Controller
{
    public function distributerassignclient(Request $request) {


        $customer = JWTAuth::parseToken()->authenticate();

        $query = AssignClient::join('users as clients', 'clients.id', '=', 'assign_clients.client_id')
            ->join('user_information', 'user_information.user_id', '=', 'assign_clients.client_id')
            ->join('users as disbs', 'disbs.id', '=', 'assign_clients.distributor_id')
            ->join('products', 'user_information.product_id', '=', 'products.id')
            ->select(
                'clients.name as cname',
                'disbs.name',
                'clients.email as cemail',
                'user_information.mobile_number',
                'products.title as pname'
            )
            ->where('assign_clients.distributor_id', $customer->id);

        // Apply date filters if provided
        Log::info($request->start_date);
        if ($request->start_date) {
            $query->whereDate('assign_clients.created_at', '>=', $request->start_date);
        }

        if ($request->end_date) {
            $query->whereDate('assign_clients.created_at', '<=', $request->end_date);
        }


        return $query->get();
    }

    public function commissionReport(){
        $dsb = JWTAuth::parseToken()->authenticate();
        $commission = SoftwareCommission::with('client')->where('user_id',$dsb->id)->get();
        return \response()->json(['commission'=>$commission]);
    }

    public function graphView(){
        $customer = JWTAuth::parseToken()->authenticate();

        $query = AssignClient::join('users as clients', 'clients.id', '=', 'assign_clients.client_id')
            ->join('user_information', 'user_information.user_id', '=', 'assign_clients.client_id')
            ->join('users as disbs', 'disbs.id', '=', 'assign_clients.distributor_id')
            ->leftJoin('products', 'user_information.product_id', '=', 'products.id')
            ->select(
                DB::raw('DATE(assign_clients.created_at) as date'),
                DB::raw('COUNT(assign_clients.id) as count') // Count of assignments per day
            )
            ->where('assign_clients.distributor_id', $customer->id)
            ->groupBy('date')
            ->orderBy('date', 'asc'); // Ensure data is ordered by date

        return response()->json($query->get());

    }


    public function CategoryRatereport(){
        $customer = JWTAuth::parseToken()->authenticate();



        return Order::join('order_details','order_details.order_id','=','orders.id')
        ->join('product_services','product_services.id','=','order_details.product_id')
        ->join('rate_masters','rate_masters.id','=','product_services.rate_id')
        ->select('rate_masters.labelhere as category','product_services.name','orders.total_price','order_details.qty','orders.created_at')

        ->where('product_services.created_by', $customer->id)
        ->get();
        // return response()->json($query->get());
    }

    public function productReportOnSale()
{
    $customer = JWTAuth::parseToken()->authenticate();

    return Order::join('order_details', 'order_details.order_id', '=', 'orders.id')
        ->join('product_services', 'product_services.id', '=', 'order_details.product_id')
        ->select(
            'product_services.name',
            \DB::raw('SUM(order_details.qty) as total_quantity'),
            \DB::raw('SUM(orders.total_price) as total_sales')
        )
        ->groupBy('product_services.name')
        ->where('product_services.created_by', $customer->id)
        ->get();
}





public function billingReportOnPurchase()
{
    $customer = JWTAuth::parseToken()->authenticate();

    return Order::join('order_details', 'order_details.order_id', '=', 'orders.id')
        ->join('users', 'users.id', '=', 'orders.customer_id')
        ->join('customers', 'users.id', '=', 'customers.user_id')
        ->join('product_services', 'product_services.id', '=', 'order_details.product_id')
        ->select(
            'orders.billno',
            'orders.date as bill_date',
            'users.name as customer_name',
            'customers.phone as customer_phone',
            // 'orders.order_slip',
            DB::raw('MAX(orders.order_slip) as order_slip'), // ✅ fix
            DB::raw('SUM(orders.bill_inv) as bill_inv'), // ✅ fix
            DB::raw('SUM(order_details.qty) as quantity'),
            DB::raw('SUM(orders.total_price) as total_price'),
            DB::raw('MIN(orders.created_at) as order_date'),
            DB::raw('MAX(orders.id) as pdf_id')
        )
        ->where('product_services.created_by', $customer->id)
        ->groupBy('orders.billno', 'orders.date', 'users.name', 'customers.phone')
        ->get();
}


// public function billingReportOnPurchase()
// {
//     $customer = JWTAuth::parseToken()->authenticate();
//     return Order::join('order_details', 'order_details.order_id', '=', 'orders.id')

//         ->join('users', 'users.id', '=', 'orders.customer_id')
//         ->join('customers', 'users.id', '=', 'customers.user_id')
//         ->join('product_services','product_services.id', '=', 'order_details.product_id')
//         ->select(
//             'product_services.name as product_name',
//             'users.name as customer_name',
//             'customers.phone as customer_phone',
//             'orders.billno',
//             'orders.date as bill_date',
//             'orders.date as order_date',
//             'orders.total_price',
//             'order_details.qty as quantity',
//             'order_details.gross_weight as gross_weight',
//              'order_details.net_weight as net_weight',
//             'order_details.rate as rate',
//             'orders.created_at as order_date',
//             'orders.id as pdf_id'
//         )
//         ->where('product_services.created_by', $customer->id)
//         ->get();
// }

//Gst Report
// public function gstReport()
// {

//     return Order::join('order_details', 'order_details.order_id', '=', 'orders.id')
//     ->join('taxes', 'taxes.id', '=', 'order_details.tax_rate')

//         ->join('users', 'users.id', '=', 'orders.customer_id')
//         ->join('customers', 'users.id', '=', 'customers.user_id')
//         ->join('product_services','product_services.id', '=', 'order_details.product_id')
//         ->select(
//             'product_services.name as product_name',
//             'users.name as customer_name',
//             'customers.phone as customer_phone',
//             'orders.billno',
//             'orders.date as bill_date',
//             'orders.date as order_date',
//             'orders.total_price',
//             'order_details.qty as quantity',
//             'order_details.gross_weight as gross_weight',
//              'order_details.net_weight as net_weight',
//             'order_details.rate as rate',
//             'orders.created_at as order_date',
//             'taxes.name as tax_name',
//         )

//         ->get();

// }

//gst
// public function gstReportDemo()
// {
//     return Order::join('order_details', 'order_details.order_id', '=', 'orders.id')
//         ->leftJoin('taxes', 'taxes.id', '=', 'order_details.tax_rate') // <-- changed to leftJoin
//         ->join('users', 'users.id', '=', 'orders.customer_id')
//         ->join('customers', 'users.id', '=', 'customers.user_id')
//         ->join('product_services', 'product_services.id', '=', 'order_details.product_id')
//         ->select(
//             'product_services.name as product_name',
//             'users.name as customer_name',
//             'customers.phone as customer_phone',
//             'orders.billno',
//             'orders.date as bill_date',
//             'orders.total_price',
//             'order_details.qty as quantity',
//             'order_details.gross_weight as gross_weight',
//             'order_details.net_weight as net_weight',
//             'order_details.rate as rate',
//             'orders.created_at as order_date',
//             'taxes.name as tax_name',
//             'taxes.amount as tax_rate' // add tax amount/rate
//         )
//         ->get();
// }


//gst report gstReport
// public function gstReport()
// {
//     // $user = Auth::user();
//     $customer = JWTAuth::parseToken()->authenticate();


//     $query = Order::join('order_details', 'orders.id', '=', 'order_details.order_id')
//         ->join('product_services', 'order_details.product_id', '=', 'product_services.id')
//         ->join('users', 'orders.customer_id', '=', 'users.id')
//         ->leftJoin('taxes', 'order_details.tax_rate', '=', 'taxes.id')
//         ->select(
//             'orders.billno',
//             'orders.date as invoice_date',
//             'users.name as customer_name',
//             'product_services.name as product_name',
//             'order_details.qty',
//             'order_details.rate',
//             'taxes.name as tax_name',
//             // DB::raw('(order_details.qty * order_details.rate) as taxable_value'),
//             'taxes.amount as gst_percent',
//             'taxes.fixed_amount as gst_amt',
//             'orders.total_price as total_price',
//             // DB::raw('ROUND(((order_details.qty * order_details.rate) * taxes.amount / 100), 2) as gst_amount'),
//             // DB::raw('ROUND((order_details.qty * order_details.rate) + ((order_details.qty * order_details.rate) * taxes.amount / 100), 2) as total_amount')
//         )
//         ->where('orders.created_by', $customer->id);



//     return $query->get();
// }

public function gstReport()
{
    // $user = Auth::user();
    $customer = JWTAuth::parseToken()->authenticate();

    $query = Order::join('order_details', 'orders.id', '=', 'order_details.order_id')
        ->join('product_services', 'order_details.product_id', '=', 'product_services.id')
        ->join('users', 'orders.customer_id', '=', 'users.id')
        ->leftJoin('taxes', 'order_details.tax_rate', '=', 'taxes.id')
        ->select(
            'orders.billno',
            'orders.id as id',
            'orders.totalqty as total_qty',
            'orders.totalTax as total_tax',
            'orders.date as invoice_date',
            'users.name as customer_name', 
        )
        ->where('orders.created_by', $customer->id)
        ->groupBy(
            'orders.billno',
            'orders.date',
            'orders.id', // Group by the orders.id
            'orders.totalqty', // Add orders.totalqty to the GROUP BY clause
            'orders.totalTax' , // Add orders.totalTax to the GROUP BY clause
            'users.name', 
        );

    return $query->get();
}






//barcode report -done
public function barcodeReport()

{
           $admin = JWTAuth::parseToken()->authenticate();

        $printHistory = BarcodePrintHistory::with(['product', 'barcode', 'user'])
            ->where('printed_by', $admin->id)
            ->get();

        return response()->json($printHistory);

}

//party report
// public function partyReport()
// {
//     $customer = JWTAuth::parseToken()->authenticate();




//     return Order::join('order_details', 'order_details.order_id', '=', 'orders.id')
//         ->join('users', 'users.id', '=', 'orders.customer_id')
//         ->join('customers', 'users.id', '=', 'customers.user_id')
//         ->join('product_services', 'product_services.id', '=', 'order_details.product_id')
//         ->select(
//             'product_services.name as product_name',
//             'users.name as customer_name',
//             'customers.phone as customer_phone',
//             'orders.billno',
//             'orders.date as bill_date',
//             'orders.total_price',
//             'order_details.qty as quantity',
//             'order_details.gross_weight as gross_weight',
//             'order_details.net_weight as net_weight',
//             'order_details.rate as rate'
//         )
//         ->where('product_services.created_by', $customer->id)
//         ->get();
// }


//salesRegisterReport
public function salesRegisterReport()
{
    // $user = Auth::user();

    $query = Order::join('order_details', 'orders.id', '=', 'order_details.order_id')
        ->join('product_services', 'order_details.product_id', '=', 'product_services.id')
        ->join('users', 'orders.customer_id', '=', 'users.id')
        ->leftJoin('taxes', 'taxes.id', '=', 'order_details.tax_rate')
        ->select(
            'orders.billno',
            'orders.date as invoice_date',
            'users.name as customer_name',
            'product_services.name as product_name',
            'order_details.qty',
            'order_details.rate',
            'taxes.amount as tax_percent',
            DB::raw('(order_details.rate * order_details.qty) as subtotal'),
            DB::raw('((order_details.rate * order_details.qty) * taxes.amount / 100) as tax_amount'),
            DB::raw('((order_details.rate * order_details.qty) + ((order_details.rate * order_details.qty) * taxes.amount / 100)) as total')
        );
        // ->where('orders.created_by', $user->id);

    // // Optional: Filter by date range
    // if ($request->has('start_date') && $request->has('end_date')) {
    //     $query->whereBetween('orders.date', [$request->start_date, $request->end_date]);
    // }

    return $query->get();
}

//agent report for demo
public function agentReport(Request $request)
{
    $query = Order::join('order_details', 'orders.id', '=', 'order_details.order_id')
        ->join('product_services', 'order_details.product_id', '=', 'product_services.id')
        ->join('users as customers', 'orders.customer_id', '=', 'customers.id')
        ->join('users as agents', 'orders.agent_id', '=', 'agents.id')
        ->select(
            'agents.name as agent_name',
            'orders.billno',
            'orders.date as order_date',
            'customers.name as customer_name',
            'product_services.name as product_name',
            'order_details.qty',
            'order_details.rate',
            DB::raw('(order_details.qty * order_details.rate) as total_value'),
            'order_details.commission_rate',
            DB::raw('ROUND((order_details.qty * order_details.rate * order_details.commission_rate / 100), 2) as commission_amount')
        );



    return $query->get();
}

//cash report
// public function cashreport()
// {
//     $customer = JWTAuth::parseToken()->authenticate();




//     $query = Payment::join('orders', 'orders.id', '=', 'payments.order_id')
//     ->join('order_details', 'order_details.order_id', '=', 'orders.id')
//         ->join('product_services', 'order_details.product_id', '=', 'product_services.id')
//         ->join('users', 'orders.customer_id', '=', 'users.id')
//         ->select(
//             'orders.billno',

//             'users.name as customer_name',
//             'product_services.name as product_name',
//             'order_details.qty',
//             'order_details.rate',
//             'payments.payment_date',
//             'payments.payment_method',
//             'payments.price',
//             'payments.created_at',
//         )
//         ->where('product_services.created_by', $customer->id);


//     return $query->get();

// }
public function cashreport()
{
    $customer = JWTAuth::parseToken()->authenticate();

    $query = Payment::join('orders', 'orders.id', '=', 'payments.order_id')
        ->join('order_details', 'order_details.order_id', '=', 'orders.id')
        ->join('product_services', 'order_details.product_id', '=', 'product_services.id')
        ->join('users', 'orders.customer_id', '=', 'users.id')
        ->select(
            'orders.billno',
            'orders.id as id',
            'users.name as customer_name',
            DB::raw('SUM(order_details.qty) as total_qty'),
            DB::raw('SUM(order_details.rate * order_details.qty) as total_amount'),
            DB::raw('SUM(payments.price) as total_paid'),
            DB::raw('MIN(payments.payment_date) as payment_date'),
            DB::raw('GROUP_CONCAT(DISTINCT payments.payment_method) as payment_methods'),
            DB::raw('MIN(payments.created_at) as created_at')
        )
        ->where('product_services.created_by', $customer->id)
        ->groupBy('orders.billno', 'orders.id', 'users.name'); // Include orders.id here

    return $query->get();
}



//sales report

// $customer = JWTAuth::parseToken()->authenticate();
// ->where('product_services.created_by', $customer->id);

public function salesReport()
{
    $customer = JWTAuth::parseToken()->authenticate();
    $query = Payment::join('orders', 'orders.id', '=', 'payments.order_id')
    ->join('order_details', 'order_details.order_id', '=', 'orders.id')
        ->join('product_services', 'order_details.product_id', '=', 'product_services.id')
        ->join('users', 'orders.customer_id', '=', 'users.id')
        ->select(
            'orders.billno',

            'users.name as customer_name',
            'product_services.name as product_name',
            'order_details.qty',
            'order_details.rate',
            'payments.payment_date',
            'payments.payment_method',
            'payments.price',
            'payments.created_at',
        )
        ->where('product_services.created_by', $customer->id);


    return $query->get();
}

//agents sales  report

public function agentsalesReport()
{
    $customer = JWTAuth::parseToken()->authenticate();

    $query = Payment::join('orders', 'orders.id', '=', 'payments.order_id')
        ->join('order_details', 'order_details.order_id', '=', 'orders.id')
        ->join('product_services', 'order_details.product_id', '=', 'product_services.id')
        ->join('users as customers', 'orders.customer_id', '=', 'customers.id')
        ->join('users', 'users.id', '=', 'orders.salesman_id')
        ->join('employees', 'employees.user_id', '=', 'users.id')
        ->select(
            'orders.billno',
            DB::raw('MAX(orders.total_price) as total_price'),
            DB::raw('MAX(orders.id) as id'),
            DB::raw('MAX(users.name) as agent_name'),
            DB::raw('MAX(customers.name) as customer_name'),
            DB::raw('MAX(orders.totalqty) as total_qty'),
            DB::raw('GROUP_CONCAT(product_services.name SEPARATOR ", ") as product_names'),
            DB::raw('MAX(payments.payment_date) as payment_date'),
            DB::raw('MAX(payments.payment_method) as payment_method'),
            DB::raw('SUM(payments.price) as total_paid'),
            DB::raw('MAX(orders.created_at) as order_date'),
            DB::raw('MAX(employees.user_id) as employee_id')
        )
        ->where('product_services.created_by', $customer->id)
        ->groupBy('orders.billno');

    return $query->get();
}


//party wise purchase report


// public function partyWisePurchaseReport()
// {
//     $customer = JWTAuth::parseToken()->authenticate();
//     return Purchase::join('purchase_items', 'purchase_items.purchase_id', '=', 'purchases.id')
//     ->join('suppliers', 'suppliers.id', '=', 'purchases.user_id')
//     // ->join('users', 'users.id', '=', 'purchases.user_id')

//         ->select(
//             'suppliers.name as supplier_name',
//             'suppliers.phone_number as supplier_phone',
//             'purchases.bill_no',
//             'purchases.voucher_no',
//             'purchases.date',

//             'purchases.payment_mode',
//             'purchases.credit_days',
//             'purchases.created_at',
//             'purchase_items.product_name as product_name',
//             'purchase_items.pcs as quantity',
//             'purchase_items.gwt as gross_weight',
//             'purchase_items.nwt as net_weight',
//             'purchase_items.rate as rate',
//             'purchase_items.other_chg as other_charge',
//             'purchase_items.disc as discount',
//             'purchase_items.disc_percent as discount_percent',
//             'purchase_items.gst as gst_percent',
//             'purchase_items.taxable as taxable_amount',
//             'purchase_items.total_gst as total_gst',
//             'purchase_items.net_amount as total_amount',



//         )
//         ->where('purchases.created_by', $customer->id)
//         ->get();
// }


public function partyWisePurchaseReport(){
    $customer = JWTAuth::parseToken()->authenticate();

    $query = Payment::join('orders', 'orders.id', '=', 'payments.order_id')
        ->join('order_details', 'order_details.order_id', '=', 'orders.id')
        ->join('product_services', 'order_details.product_id', '=', 'product_services.id')
        ->join('users as customers', 'orders.customer_id', '=', 'customers.id')
        // ->join('users as customerss', 'customerss.id', '=', 'orders.customer_id')
        ->join('users', 'users.id', '=', 'orders.salesman_id')
        ->join('employees', 'employees.user_id', '=', 'users.id')
        ->select(
            'orders.billno',
            DB::raw('MAX(orders.total_price) as total_price'),
            DB::raw('MAX(orders.id) as id'),
            DB::raw('MAX(users.name) as agent_name'),
            DB::raw('MAX(customers.name) as customer_name'),
            DB::raw('MAX(customers.id) as customer_id'),
            DB::raw('MAX(orders.totalqty) as total_qty'),
            DB::raw('GROUP_CONCAT(product_services.name SEPARATOR ", ") as product_names'),
            DB::raw('MAX(payments.payment_date) as payment_date'),
            DB::raw('MAX(payments.payment_method) as payment_method'),
            DB::raw('SUM(payments.price) as total_paid'),
            DB::raw('MAX(orders.created_at) as order_date'),
            // DB::raw('MAX(employees.user_id) as employee_id'),
            // DB::raw('MAX(orders.customer_id) as employee_id')
        )
        ->where('product_services.created_by', $customer->id)
        ->groupBy('orders.billno');

    return $query->get();

}




public function getPaymentTotalByMethod(Request $request)
{
    
    
    $user = JWTAuth::parseToken()->authenticate();

    $from = $request->query('from_date');
    $to = $request->query('to_date');

    if ($from && $to) {
        // Validate date format
        $request->validate([
            'from_date' => 'date',
            'to_date' => 'date',
        ]);

        $payments = Payment::where('created_by', $user->id)
            ->whereBetween('payment_date', [$from, $to])
            ->get();
    } else {
        // Default to today's date
        $today = Carbon::today()->toDateString();
        $payments = Payment::where('created_by', $user->id)
            ->whereDate('payment_date', $today)
            ->get();
    }

    $summary = $payments->groupBy('payment_method')->map(function ($group) {
        return $group->sum('price');
    });

    return response()->json([
        'message' => 'Payment summary fetched successfully.',
        'summary' => $summary,
    ]);
}

//saloon daily case 
// public function dailycaseSaloon(Request $request)
// {
    
    
//     $user = JWTAuth::parseToken()->authenticate();

//     $from = $request->query('from_date');
//     $to = $request->query('to_date');

//     if ($from && $to) {
//         // Validate date format
//         $request->validate([
//             'from_date' => 'date',
//             'to_date' => 'date',
//         ]);

//         $payments = SaloonPayment::where('created_by', $user->id)
//             ->whereBetween('payment_date', [$from, $to])
//             ->get();
//     } else {
//         // Default to today's date
//         $today = Carbon::today()->toDateString();
//         $payments = SaloonPayment::where('created_by', $user->id)
//             ->whereDate('payment_date', $today)
//             ->get();
//     }

//     $summary = $payments->groupBy('payment_method')->map(function ($group) {
//         return $group->sum('price');
//     });

//     return response()->json([
//         'message' => 'Payment summary fetched successfully.',
//         'summary' => $summary,
//     ]);
// }
public function dailycaseSaloon(Request $request)
{
    $user = JWTAuth::parseToken()->authenticate();

    $from = $request->query('from_date');
    $to = $request->query('to_date');

    if ($from && $to) {
        // Validate date format
        $request->validate([
            'from_date' => 'date',
            'to_date' => 'date',
        ]);

        $payments = SaloonPayment::where('created_by', $user->id)
            ->whereBetween('payment_date', [$from, $to])
            ->get();
    } else {
        // Default to today's date
        $today = Carbon::today()->toDateString();
        $payments = SaloonPayment::where('created_by', $user->id)
            ->whereDate('payment_date', $today)
            ->get();
    }

    // Default summary
    $defaultSummary = [
        'cash' => 0,
        'card' => 0,
        'upi'  => 0,
    ];

    // Group and sum payments
    $actualSummary = $payments->groupBy('payment_method')->map(function ($group) {
        return $group->sum('price');
    })->toArray();

    // Merge actual into default
    $summary = array_merge($defaultSummary, $actualSummary);

    return response()->json([
        'message' => 'Payment summary fetched successfully.',
        'summary' => $summary,
    ]);
}



}
