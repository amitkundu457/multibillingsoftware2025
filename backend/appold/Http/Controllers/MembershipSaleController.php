<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\MembershipSale;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Log;

class MembershipSaleController extends Controller
{
    public function index()
    {
        $customer=JWTAuth::parseToken()->authenticate();
        $sales = MembershipSale::with(['customer', 'plan', 'stylist'])
        ->where('created_by',$customer->id)
        ->get();
        return response()->json($sales);
    }

    public function store(Request $request)
{
    $customer = JWTAuth::parseToken()->authenticate();

    $validated = $request->validate([
        'customer_id' => 'required',
        'plan_id' => 'required',
        'stylist_id' => 'required',
        'sale_date' => 'required|date',
        'amount' => 'nullable|numeric',
        'payment_method' => 'required',
    ]);

    // Generate unique member_number
    $latestSale = MembershipSale::latest()->first();
    $nextNumber = $latestSale ? ((int) filter_var($latestSale->member_number, FILTER_SANITIZE_NUMBER_INT)) + 1 : 176;
    $datePart = Carbon::now()->format('Y-m-d');
    $memberNumber = "MEM BN{$nextNumber}-{$datePart}";

    // Add member_number to the validated data
    $validated['member_number'] = $memberNumber;
    $validated['created_by']=$customer->id;

    // Create the membership sale
    $sale = MembershipSale::create($validated);

    return response()->json($sale, 201);
}

    public function update(Request $request, $id)
    {
        Log::info($id);
        $sale = MembershipSale::findOrFail($id);
Log::info(  $sale);
        $validated = $request->validate([
            'customer_id' => 'required|exists:users,id',
            'plan_id' => 'required|exists:membership_plans,id',
            'stylist_id' => 'required|exists:stylists,id',
            'sale_date' => 'required|date',
            'amount' => 'required|numeric',
            'payment_method' => 'required',
        ]);

        $sale->update($validated);
        return response()->json($sale);
    }

    public function destroy($id)
    {
        MembershipSale::destroy($id);
        return response()->json(['message' => 'Sale deleted']);
    }


    public function reportmember(Request $request)
{
    $customer = JWTAuth::parseToken()->authenticate();

    $query = MembershipSale::with(['customer', 'plan', 'stylist'])
    ->where('created_by', $customer->id);


    // Filter by date range
    if (!empty($request->from) && !empty($request->to)) {
        $from = \Carbon\Carbon::parse($request->from)->startOfDay();
        $to = \Carbon\Carbon::parse($request->to)->endOfDay();
        $query->whereBetween('sale_date', [$from, $to]);
    }

    // Filter by membership plan
    if ($request->has('membership_plan') && $request->membership_plan !== 'all') {
        $query->whereHas('plan', function ($q) use ($request) {
            $q->where('id', $request->membership_plan);
        });
    }

    // Filter by expiry status
    if ($request->filled('status')) {
        $status = $request->status;

        if ($status === 'active') {
            $query->whereRaw("DATE_ADD(sale_date, INTERVAL validity DAY) >= CURDATE()");
        } elseif ($status === 'expired') {
            $query->whereRaw("DATE_ADD(sale_date, INTERVAL validity DAY) < CURDATE()");
        }
    }

    // Retrieve data and calculate expiry dynamically
    $sales = $query->get()->map(function ($sale) {
        if ($sale->sale_date && optional($sale->plan)->validity) {
            $expiryDate = \Carbon\Carbon::parse($sale->sale_date)->addDays($sale->plan->validity);
            $sale->expiry_date = $expiryDate->format('Y-m-d');
            $sale->status = $expiryDate->greaterThanOrEqualTo(now()) ? 'Active' : 'Expired';
        } else {
            $sale->expiry_date = null;
            $sale->status = 'Expired';
        }

        return $sale;
    });

    return response()->json($sales);
}


public function getMembershipSummary()
{
    $summary = DB::table('membership_plans')
        ->leftJoin('membership_sales', 'membership_plans.id', '=', 'membership_sales.plan_id')
        ->select(
            'membership_plans.name as membership_name',
            'membership_plans.validity',
            'membership_plans.fees',
            'membership_plans.discount',
            DB::raw('COUNT(membership_sales.id) as sold'),
            DB::raw('SUM(CASE WHEN DATE_ADD(membership_sales.sale_date, INTERVAL membership_plans.validity MONTH) >= NOW() THEN 1 ELSE 0 END) as active'),
            DB::raw('SUM(CASE WHEN DATE_ADD(membership_sales.sale_date, INTERVAL membership_plans.validity MONTH) < NOW() THEN 1 ELSE 0 END) as expired')
        )
        ->groupBy('membership_plans.id')
        ->get();

    return response()->json($summary);
}

public function getMembershipsByCustomer($customerId)
{
    $memberships = MembershipSale::where('customer_id', $customerId)
    ->with('plan')
    ->with('stylist')
    ->get();

    if ($memberships->isEmpty()) {
        return response()->json(['message' => 'No memberships found for this customer.'], 404);
    }

    return response()->json($memberships, 200);
}


}
