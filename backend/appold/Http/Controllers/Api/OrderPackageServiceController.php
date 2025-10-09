<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\OrderPackageService;
use App\Models\OrderPackageServiceDetail;



class OrderPackageServiceController extends Controller
{
    //

    public function printData($id)
    {
        $invoice = OrderPackageService::with(['serviceDetails', 'users', 'users.customers', 'package'])->findOrFail($id);
        return response()->json($invoice);



    }



    public function store(Request $request){

        $request->validate([
            'package_number' => 'nullable|string',
           'customer_id' => 'nullable|exists:customers,user_id',
            'price' => 'nullable|numeric',
            'services' => 'nullable|array',
            'services.*.id' => 'nullable|exists:package_service_names,id',
            'services.*.service_name' => 'nullable|string',
            'services.*.price' => 'nullable|numeric',
            'services.*.quantity' => 'nullable|integer',
            'services.*.additional_charge' => 'nullable|numeric',
            'services.*.selectedStylist' => 'nullable|string',
            'services.*.subtotal' => 'nullable|numeric',
        ]);

        try {
            // Store the order package
            $orderPackage = OrderPackageService::create([
                'package_number' => $request->package_number,
                'customer_id' => $request->customer_id,
                'price' => $request->price,
            ]);

            // Store each service related to this package
            foreach ($request->services as $service) {
                OrderPackageServiceDetail::create([
                    'order_package_id' => $orderPackage->id,
                    'service_id' => $service['id'],
                    'service_name' => $service['service_name'],
                    'price' => $service['price'],
                    'quantity' => $service['quantity'],
                    'additional_charge' => $service['additional_charge'] ?? 0,
                    'stylist_name' => $service['selectedStylist'] ?? null,
                    'subtotal' => $service['subtotal'],
                ]);
            }

            return response()->json([
                'message' => 'Order package created successfully',
                'orderPackage' => $orderPackage,
                'id' => $orderPackage->id
            ], 201);
        }
        catch (\Exception $e) {
             return response()->json([
                'message' => 'Failed to create order package',
                'error' => $e->getMessage()
            ], 500);
        }

    }


    public function generatePackageInvoiceNumber($id)
{
    $order = OrderPackageService::find($id);
    if (!$order) {
        return response()->json(['error' => 'Order not found'], 404);
    }

    $date = \Carbon\Carbon::parse($order->created_at)->format('Y-m-d');

    return response()->json(['invoice_number' => "PKG-{$date}-{$id}"]);
}





}
