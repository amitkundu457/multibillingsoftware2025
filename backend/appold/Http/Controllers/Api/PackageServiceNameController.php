<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\PackageServiceName;


class PackageServiceNameController extends Controller
{
    //

    public function index()
{
    // Retrieve all services
    $services = PackageServiceName::all();

    return response()->json([
        'services' => $services
    ]);
}

     // Store Services for a Package
     public function store(Request $request)
     {
         $request->validate([
             'package_id' => 'required|exists:packages,id',
             'services' => 'required|array',
             'services.*.service_name' => 'required|string',
             'services.*.price' => 'required|numeric|min:0',
             'services.*.quantity' => 'required|numeric|min:0',

         ]);

         foreach ($request->services as $service) {
             PackageServiceName::create([
                 'package_id' => $request->package_id,
                 'service_name' => $service['service_name'],
                 'price' => $service['price'],
                 'quantity' => $service['quantity'],

             ]);
         }

         return response()->json(['message' => 'Services added successfully'], 201);
     }
}
