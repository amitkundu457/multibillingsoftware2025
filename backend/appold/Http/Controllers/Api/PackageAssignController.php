<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PackageAssign;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
class PackageAssignController extends Controller
{
    // Generate next package_no and receipt_no
    private function generateNextNumbers()
    {
        $lastPackage = PackageAssign::latest('id')->first();
        $nextId = $lastPackage ? $lastPackage->id + 1 : 1;

        return [
            'package_no' => 'PACK' . str_pad($nextId, 3, '0', STR_PAD_LEFT),
            'receipt_no' => 'RCPT' . str_pad($nextId, 3, '0', STR_PAD_LEFT),
        ];
    }

    // Store new package
    public function store(Request $request ,$customer_id)
    {

        $customer = JWTAuth::parseToken()->authenticate();

        // Check if the customer has an active (non-expired) package

        $activePackage = PackageAssign::where('customer_id', $customer_id)
        ->whereDate('package_expiry', '>', now()) // Works correctly for DATE
        ->first();



    \Log::info("Current Time: " . now());
    \Log::info("Active Package Expiry: " . optional($activePackage)->package_expiry);


        // If the customer already has an active package, prevent purchase
         if ($activePackage) {
        return response()->json(['message' => 'User already has an active package membership'], 400);
        }


        $nextNumbers = $this->generateNextNumbers();



        $package = PackageAssign::create([
            'customer_id' => $customer_id,
            'package_no' => $nextNumbers['package_no'],
            'receipt_no' => $nextNumbers['receipt_no'],
            'package_name' => $request->package_name ?? 'Default Name',
            'package_amount' => $request->packageAmount ?? 0,
            'service_amount' => $request->serviceAmount ?? 0,
            'paid_amount' => $request->paidAmount ?? 0,
            'balance_amount' => $request->balanceAmount ?? 0,
            'remaining_amount' => $request->remainingAmount ?? 0,
            'receipt_amount' => $request->receiptAmount ?? 0,
            'payment_date' => $request->paymentDate,
            'package_booking' => $request->packageBooking,
            'package_expiry' => $request->packageExpiry,
            'settlement_mode' => $request->settlementMode,
            'payment_status' => $request->paymentStatus,
            'package_status' => $request->packageStatus,
            'package_id' => $request->package_id,
            'created_by' => $customer->id, // Assuming the authenticated user is the creator
        ]);



        return response()->json(['message' => 'Package stored successfully', 'data' => $package], 201);
    }

    //fetch package  purchase by customer

    public function getPackagesByCustomer($customer_id)
    {
        $packageAssigns = PackageAssign::where('customer_id', $customer_id)
        ->with(['services', 'customer','users','package']) // Fetch related services and customer details
        ->get();


    if ($packageAssigns->isEmpty()) {
        return response()->json(['message' => 'No packages or services found for this customer'], 404);
    }

    return response()->json([
        'message' => 'Package assignments retrieved successfully',
        'data' => $packageAssigns
    ], 200);
        }

    // Fetch next available package_no & receipt_no
    public function getNextNumbers()
    {
        return response()->json($this->generateNextNumbers());
    }

    public function getPackageByNumber($packageNo)
    {

 // dd($packageNo);
        $package = PackageAssign::where('package_no', $packageNo)
        ->select([
            'package_no',
            'package_amount as packageAmount',
            'service_amount as serviceAmount',
            'paid_amount as paidAmount',
            'balance_amount as balanceAmount',
            'remaining_amount as remainingAmount',
            'receipt_amount as receiptAmount',
            'payment_date as paymentDate',
            'package_booking as packageBooking',
            'package_expiry as packageExpiry',
            'settlement_mode as settlementMode',
            'payment_status as paymentStatus',
            'package_status as packageStatus',
            'package_id',
            'receipt_no as receiptNo'
        ])
        ->first();


        if (!$package) {
            return response()->json(['message' => 'Package not found'], 404);
        }

        return response()->json($package);
    }



    public function update(Request $request, $packageNo)
{
    // Find the package by package_no
    $package = PackageAssign::where('package_no', $packageNo)->first();

    // If package is not found, return an error response
    if (!$package) {
        return response()->json(['message' => 'Package not found'], 404);
    }

    // Validate incoming request data
    // $request->validate([
    //     'package_amount' => 'required|numeric',
    //     'service_amount' => 'required|numeric',
    //     'paid_amount' => 'required|numeric',
    //     'balance_amount' => 'required|numeric',
    //     'remaining_amount' => 'required|numeric',
    //     'receipt_amount' => 'required|numeric',
    //     'payment_date' => 'required|date',
    //     'package_booking' => 'required|date',
    //     'package_expiry' => 'required|date',
    //     'settlement_mode' => 'required|string',
    //     'payment_status' => 'required|string',
    //     'package_status' => 'required|string',
    //     'package_id' => 'required|integer'
    // ]);

    // Update package details
    $package->fill([
        'package_amount' => $request->packageAmount,
        'service_amount' => $request->serviceAmount,
        'paid_amount' => $request->paidAmount,
        'balance_amount' => $request->balanceAmount,
        'remaining_amount' => $request->remainingAmount,
        'receipt_amount' => $request->receiptAmount,
        'payment_date' => $request->paymentDate,
        'package_booking' => $request->packageBooking,
        'package_expiry' => $request->packageExpiry,
        'settlement_mode' => $request->settlementMode,
        'payment_status' => $request->paymentStatus,
        'package_status' => $request->packageStatus,
        'package_id' => $request->package_id,
    ]);

    $package->save();


    return response()->json(['message' => 'Package updated successfully', 'data' => $package], 200);
}


public function updatePayment(Request $request){

    $request->validate([
        'package_no' => 'required|string',
        'paid_amount' => 'required|numeric|min:0',
    ]);

      // Find the package
      $package = PackageAssign::where('package_no', $request->package_no)->firstOrFail();

       // Update paid amount (Add new payment to existing one)
       $package->paid_amount += $request->paid_amount;

       // Update remaining amount (Subtract paid amount)
       $package->remaining_amount -= $request->paid_amount;

        // Ensure remaining amount doesn't go negative
        if ($package->remaining_amount < 0) {
            $package->remaining_amount = 0;
        }

        // Save updated values
        $package->save();

        return response()->json([
            'success' => true,
            'message' => 'Payment updated successfully',
            'data' => $package
        ]);
}
}
