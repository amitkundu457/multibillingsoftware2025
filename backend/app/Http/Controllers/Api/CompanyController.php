<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Company;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Log;

class CompanyController extends Controller
{
    // public function index()
    // {
    //     $customer = JWTAuth::parseToken()->authenticate();
    //     Log::info('Authenticated Customer:', ['customer' => $customer]);
           
    //     $groups = Company::all();
    //     return response()->json($groups);
    // }
    public function index()
{
    $customer = JWTAuth::parseToken()->authenticate();
    Log::info('Authenticated Customer:', ['customer' => $customer]);

    // Fetch only records created by the authenticated customer
    $groups = Company::where('created_by', $customer->id)->get();

    return response()->json($groups);
}


    // Store a new product service group (returns JSON)
    // public function store(Request $request)
    // {
    //     $customer = JWTAuth::parseToken()->authenticate();
    //     Log::info('Authenticated Customer:', ['customer' => $customer]);

    //     $request->validate([
    //         'name' => 'required|string|max:255',
    //     ]);

    //     $group = Company::create($request->all());

    //     return response()->json(['message' => 'Product Service Group created successfully.', 'data' => $group]);
    // }
    public function store(Request $request)
{
    $customer = JWTAuth::parseToken()->authenticate();
    Log::info('Authenticated Customer:', ['customer' => $customer]);

    $request->validate([
        'name' => 'required|string|max:255',
    ]);

    // Merge 'created_by' into request data
    $data = $request->all();
    $data['created_by'] = $customer->id;

    $group = Company::create($data);

    return response()->json([
        'message' => 'Product Service Group created successfully.',
        'data' => $group
    ]);
}


    // Show the form to edit a product service group (returns JSON)
    public function show(Company $Company)
    {
        return response()->json($Company);
    }

    // Update a product service group (returns JSON)
    public function update(Request $request, Company $Company)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $Company->update($request->all());

        return response()->json(['message' => 'Product Service Group updated successfully.', 'data' => $Company]);
    }

    // Delete a product service group (returns JSON)
    public function destroy(Company $Company)
    {
        $Company->delete();

        return response()->json(['message' => 'Product Service Group deleted successfully.']);
    }
}
