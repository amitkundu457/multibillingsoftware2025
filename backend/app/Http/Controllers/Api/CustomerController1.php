<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\Order;
use App\Models\CustomersubType;
use App\Models\CustomerType;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;


class CustomerController extends Controller
{
    // Fetch all customers
   // Fetch all customers
public function index()
{

    $customer = JWTAuth::parseToken()->authenticate();

    $customers = Customer::join('users', 'users.id', '=', 'customers.user_id')
            ->select(
                'users.name',
                'users.id',
                'customers.dob',
                'customers.phone',
               'customers.customer_type',
               'customers.customer_sub_type',
                'users.email',
                'customers.anniversary',
                'customers.gender',
                'customers.pincode',
                'customers.state',
                'customers.country',
                'customers.address',
                'customers.remarke',
                'customers.visit_source'
            )
            ->where('customers.created_by', $customer->id)
            ->get();

        return response()->json($customers, 200);




}

//fetach cutomer by id with both table
// public function show($id)
// {
//     // Fetch customer with related user data
//     $customer = Customer::with('userc')->find($id);

//     if (!$customer) {
//         return response()->json([
//             'success' => false,
//             'message' => 'Customer not found',
//         ], 404);
//     }

//     return response()->json([
//         'success' => true,
//         'data' => $customer
//     ]);
// }

public function show($id)
{
    // Eager load both userc and userc.information
    $customer = Customer::with('userc.information')->find($id);

    if (!$customer) {
        return response()->json([
            'success' => false,
            'message' => 'Customer not found',
        ], 404);
    }

    return response()->json([
        'success' => true,
        'data' => $customer
    ]);
    }
//count enuries by customer


public function customerequires()
{
    $customer = JWTAuth::parseToken()->authenticate();

    // Count prospective customers created today by the authenticated user
    $prospectiveCount = Customer::where('created_by', $customer->id)
        ->where('customerEnquiry', 'prospective')
        ->whereDate('created_at', Carbon::today())
        ->count();

    return response()->json([
        'prospective_count_today' => $prospectiveCount
    ], 200);
}





    // Create a new customer
    public function store(Request $request)
    {

        $admin = JWTAuth::parseToken()->authenticate();
        $validatedData = $request->validate([
            'name' => 'nullable|string|max:255',
            'email' => 'nullable|email|unique:users,email',
            'password' => 'nullable',
            'phone' => 'nullable|string|max:15',
           'customerSubTypeData' => 'nullable',
            'customerTypeData' => 'nullable',
            'dob' => 'nullable|date',
            'anniversary' => 'nullable|date',
            'gender' => 'nullable|string',
            'address' => 'nullable|string',
            'pincode' => 'nullable|string|max:10',
            'state' => 'nullable|string|max:255',
            'country' => 'nullable|string|max:255',
            'visit_source' => 'nullable|string|max:255',

        ]);
// ✅ Check if phone exists for this admin
if (!empty($validatedData['phone'])) {
    $existing = Customer::where('phone', $validatedData['phone'])
        ->where('created_by', $admin->id)
        ->first();

    if ($existing) {
        return response()->json([
            'success' => false,
            'message' => 'This number already exists.'
        ], 409);
    }
}
        // Store user data
        $user = User::create([
            'name' => $validatedData['name'],
            'email' => $validatedData['email'],
            'password' => bcrypt('12345678'),
        ]);

        // Store customer data
        $customer = Customer::create([
            'user_id' => $user->id,
            'phone' => $validatedData['phone'],
           'customer_type' => $validatedData['customerTypeData'] ,
           'customer_sub_type' => $validatedData['customerSubTypeData'] ,
            'dob' => $validatedData['dob'] ?? null,
            'anniversary' => $validatedData['anniversary'] ?? null,
            'gender' => $validatedData['gender'] ?? null,
            'address' => $validatedData['address'],
            'pincode' => $validatedData['pincode'],
            'state' => $validatedData['state'],
            'visit_source' => $validatedData['visit_source'],



            'country' => $validatedData['country'],
            'created_by' =>  $admin->id,
            'customerEnquiry'=>$request->customerEnquiry,
            'remarke'=>$request->remarke,

        ]);

        return response()->json([ $user, $customer ,'message' => 'Customer created successfully!'], 201);
    }

    // Update an existing customer
//     public function update(Request $request, $id)
// {
//     try {
//         // Validate request data
//         $validatedData = $request->validate([
//             'name' => 'nullable|string|max:255',
//             'email' => 'nullable|email|unique:users,email,' . $id, // Ignore current user's email
//             'password' => 'nullable|string|min:8', // Optional password update
//             'phone' => 'nullable|string|max:15',
//            'customer_type' => 'nullable|string',
//             'customer_sub_type' => 'nullable|string',
//             'customerSubTypeData' => 'nullable',
//             'customerTypeData' => 'nullable',
//             'dob' => 'nullable|date',
//             'anniversary' => 'nullable|date',
//             'gender' => 'nullable|string',
//             'address' => 'nullable|string',
//             'pincode' => 'nullable|string|max:10',
//             'state' => 'nullable|string|max:255',
//             'country' => 'nullable|string|max:255',
//             'visit_source' => 'nullable|string|max:255',


//             'customerEnquiry'=>'nullable|string|max:255',
//             'remarke'=>'nullable|string|max:255',

//         ]);

//         // Find the user and customer
//         $user = User::findOrFail($id);
//         $customer = Customer::where('user_id', $user->id)->firstOrFail();

//         // Wrap in transaction
//         DB::beginTransaction();

//         // Update user data
//         $user->update([
//             'name' => $validatedData['name'],
//             'email' => $validatedData['email'],
//             //'password' => $validatedData['password'] ? bcrypt($validatedData['password']) : $user->password,
//         ]);

//         // Update customer data
//         $customer->update([
//             'phone' => $validatedData['phone'],
//             // 'customer_type' => $validatedData['customer_type'],
//             // 'customer_sub_type' => $validatedData['customer_sub_type'],
//             'customer_type' => $validatedData['customerTypeData'] ,
//            'customer_sub_type' => $validatedData['customerSubTypeData'] ,
//             'dob' => $validatedData['dob'],
//             'anniversary' => $validatedData['anniversary'],
//             'gender' => $validatedData['gender'],
//             'address' => $validatedData['address'],
//             'pincode' => $validatedData['pincode'],
//             'state' => $validatedData['state'],
//             'country' => $validatedData['country'],
//             'visit_source' => $validatedData['visit_source'],
//             'customerEnquiry' => $validatedData['customerEnquiry'],
//             'remarke' => $validatedData['remarke'],


//         ]);

//         // Commit transaction
//         DB::commit();

//         return response()->json([$user ,$customer ,'message' => 'Customer updated successfully!'], 200);
//     } catch (\Exception $e) {
//         // Rollback transaction on error
//         DB::rollBack();

//         // Log error for debugging
//         // Log::error('Error updating customer: ' . $e->getMessage());

//         return response()->json(['message' => 'Failed to update customer.', 'error' => $e->getMessage()], 500);
//     }
// }

public function update(Request $request, $id)
{
    try {
        $validatedData = $request->validate([
            'name' => 'nullable|string|max:255',
            'email' => 'nullable|email|unique:users,email,' . $id,
            'password' => 'nullable|string|min:8',
            'phone' => 'nullable|string|max:15',
            'customer_type' => 'nullable|string',
            'customer_sub_type' => 'nullable|string',
            'customerSubTypeData' => 'nullable',
            'customerTypeData' => 'nullable',
            'dob' => 'nullable|date',
            'anniversary' => 'nullable|date',
            'gender' => 'nullable|string',
            'address' => 'nullable|string',
            'pincode' => 'nullable|string|max:10',
            'state' => 'nullable|string|max:255',
            'country' => 'nullable|string|max:255',
            'visit_source' => 'nullable|string|max:255',
            'customerEnquiry' => 'nullable|string|max:255',
            'remarke' => 'nullable|string|max:255',
        ]);

        $user = User::findOrFail($id);
        $customer = Customer::where('user_id', $user->id)->firstOrFail();

        DB::beginTransaction();

        // Update user fields only if value is not null
        foreach (['name', 'email', 'password'] as $field) {
            if ($request->has($field) && $request->filled($field)) {
                if ($field === 'password') {
                    $user->password = bcrypt($request->input($field));
                } else {
                    $user->$field = $request->input($field);
                }
            }
        }
        $user->save();

        // PHONE NUMBER SPECIAL LOGIC
        if ($request->has('phone') && !is_null($request->input('phone'))) {
            $newPhone = $request->input('phone');

            if ($newPhone !== $customer->phone) {
                $duplicatePhone = Customer::where('phone', $newPhone)
                    ->where('created_by', $customer->created_by)
                    ->where('id', '!=', $customer->id)
                    ->exists();

                if ($duplicatePhone) {
                    DB::rollBack();
                    return response()->json([
                        'message' => 'Phone number already exists under this creator.'
                    ], 422);
                }

                $customer->phone = $newPhone;
            }
        }

        // Other customer fields
        $customerFields = [
            'dob', 'anniversary', 'gender', 'address',
            'pincode', 'state', 'country', 'visit_source',
            'customerEnquiry', 'remarke'
        ];

        foreach ($customerFields as $field) {
            if ($request->has($field) && !is_null($request->input($field))) {
                $customer->$field = $request->input($field);
            }
        }

        // Mapped data (custom fields)
        if ($request->has('customerTypeData') && !is_null($request->input('customerTypeData'))) {
            $customer->customer_type = $request->input('customerTypeData');
        }

        if ($request->has('customerSubTypeData') && !is_null($request->input('customerSubTypeData'))) {
            $customer->customer_sub_type = $request->input('customerSubTypeData');
        }

        $customer->save();
        DB::commit();

        return response()->json([$user, $customer, 'message' => 'Customer updated successfully!'], 200);

    } catch (\Exception $e) {
        DB::rollBack();
        return response()->json([
            'message' => 'Failed to update customer.',
            'error' => $e->getMessage()
        ], 500);
    }
}




// Get unique visit sources from existing customers
public function getVisitSourceCounts()
{
    $sources = Customer::pluck('visit_source')->filter()->toArray(); // Remove null values

    $counts = [
        'total' => count($sources),
        'walkIn' => count(array_filter($sources, fn($s) => $s === 'walkin')),
        'qr' => count(array_filter($sources, fn($s) => $s === 'qr')),
        'socialMedia' => count(array_filter($sources, fn($s) => $s === 'social_media'))
    ];

    return response()->json($counts);
}




    // Delete a customer
    // public function destroy($id)
    // {
    //     // Find the customer record or fail
    //     $customer = User::findOrFail($id);
    //     $customer->delete();

    //     return response()->json([
    //         'message' => 'Customer deleted successfully!',
    //     ], 200);
    // }


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

    public function destroy($id)
{
    // Check if the customer (by user_id) has related orders
    $hasOrders = Order::join('customers', 'orders.customer_id', '=', 'customers.user_id')
        ->where('customers.user_id', $id)
        ->exists();

    if ($hasOrders) {
        return response()->json([
            'message' => 'Cannot delete customer because they have associated orders.',
        ], 400);
    }

    // If no orders, delete the user (customer)
    $customer = User::findOrFail($id);
    $customer->delete();

    return response()->json([
        'message' => 'Customer deleted successfully!',
    ], 200);
}


    // Store a customer sub-type
    // public function subtypestore(Request $request)
    // {
    //     // Validate sub-type request
    //     $validated = $request->validate([
    //         'type_id' => 'required|exists:customer_types,id',
    //         'name' => 'required|string|max:255',
    //     ]);

    //     // Create new sub-type
    //     $subType = CustomersubType::create($validated);

    //     return response()->json([
    //         'success' => true,
    //         'message' => 'Customer Sub Type created successfully!',
    //         'data' => $subType,
    //     ], 201);
    // }

    public function subtypestore(Request $request)
{
    $customer = JWTAuth::parseToken()->authenticate();
    Log::info('Authenticated Customer:', ['customer' => $customer]);

    // Validate sub-type request
    $validated = $request->validate([
        'type_id' => 'required|exists:customer_types,id',
        'name' => 'required|string|max:255',
    ]);

    // Add 'created_by' to the validated data
    $validated['created_by'] = $customer->id;

    // Create new sub-type
    $subType = CustomersubType::create($validated);

    return response()->json([
        'success' => true,
        'message' => 'Customer Sub Type created successfully!',
        'data' => $subType,
    ], 201);
}

    // Get all customer sub-types
    // public function subtypeindex()
    // {
    //     return CustomersubType::with('customerType')->get();
    // }

    public function subtypeindex()
{
    $customer = JWTAuth::parseToken()->authenticate();
    Log::info('Authenticated Customer:', ['customer' => $customer]);

    return CustomersubType::with('customerType')
        ->where('created_by', $customer->id)
        ->get();
}

    // Update a customer sub-type
    public function subtypeupdate(Request $request, $id)
    {
        // Find the CustomerSubType by ID
        $customersubtype = CustomersubType::find($id);

        // Check if the record exists
        if (!$customersubtype) {
            return response()->json([
                'success' => false,
                'message' => 'Customer Sub Type not found!',
            ], 404);
        }

        // Validate request data
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type_id' => 'required|exists:customer_types,id',
        ]);

        // Update the record with validated data
        $customersubtype->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Customer Sub Type updated successfully!',
            'data' => $customersubtype,
        ], 200);
    }

    // Get all customer types
    // public function typeindex()
    // {
    //     $customer = JWTAuth::parseToken()->authenticate();
    // Log::info('Authenticated Customer:', ['customer' => $customer]);

    //     $customerTypes = CustomerType::all();
    //     return response()->json([
    //         'success' => true,
    //         'data' => $customerTypes,
    //     ], 200);
    // }
    public function typeindex()
{
    $customer = JWTAuth::parseToken()->authenticate();
    Log::info('Authenticated Customer:', ['customer' => $customer]);

    // Fetch only records created by the authenticated customer
    $customerTypes = CustomerType::where('created_by', $customer->id)->get();

    return response()->json([
        'success' => true,
        'data' => $customerTypes,
    ], 200);
}


    // Create a new customer type
    // public function typestore(Request $request)
    // {
    //     // Validate request data
    //     $validated = $request->validate([
    //         'name' => 'required|string|max:255',
    //     ]);

    //     // Create new customer type
    //     $subType = CustomerType::create($validated);

    //     return response()->json([
    //         'success' => true,
    //         'message' => 'Customer Type created successfully!',
    //         'data' => $subType,
    //     ], 201);
    // }
    public function typestore(Request $request)
{
    $customer = JWTAuth::parseToken()->authenticate();
    Log::info('Authenticated Customer:', ['customer' => $customer]);

    // Validate request data
    $validated = $request->validate([
        'name' => 'required|string|max:255',
    ]);

    // Merge created_by into validated data
    $validated['created_by'] = $customer->id;

    // Create new customer type
    $subType = CustomerType::create($validated);

    return response()->json([
        'success' => true,
        'message' => 'Customer Type created successfully!',
        'data' => $subType,
    ], 201);
}


    // Get a specific customer type
    public function typeshow(CustomerType $customerType)
    {
        return response()->json([
            'success' => true,
            'data' => $customerType,
        ], 200);
    }

    // Update a customer type
    public function typeupdate(Request $request, $id)
    {
        // Find the CustomerType by ID
        $customerType = CustomerType::findOrFail($id);

        // Update customer type data
        $customerType->update($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Customer Type updated successfully!',
            'data' => $customerType,
        ], 200);
    }

    // Delete a customer type
    public function typedestroy($id)
    {
        $customerType = CustomerType::findOrFail($id);
        $customerType->delete();

        return response()->json([
            'success' => true,
            'message' => 'Customer Type deleted successfully!',
        ], 200);
    }

    // Search customer by phone number
    public function searchByPhone(Request $request)
    {
        $phone = $request->query('phone');

        if (!$phone) {
            return response()->json(['message' => 'Phone number is required'], 400);
        }

        $customer = Customer::join('users', 'users.id', '=', 'customers.user_id')
        ->select('users.name', 'users.id', 'customers.address', 'customers.phone')
            // ->select('users.name', 'users.id','customers.id', 'customers.address', 'customers.phone')
            ->where('customers.phone', $phone)
            ->first();

        if (!$customer) {
            return response()->json(['message' => 'Customer not found'], 404);
        }

        return response()->json($customer, 200);
    }

    //this for restutant customer 
    public function searchByPhoneResto(Request $request)
    {
        $phone = $request->query('phone');

        if (!$phone) {
            return response()->json(['message' => 'Phone number is required'], 400);
        }

        $customer = Customer::join('users', 'users.id', '=', 'customers.user_id')
            ->select('users.name', 'users.id','customers.id', 'customers.address', 'customers.phone')
            ->where('customers.phone', $phone)
            ->first();

        if (!$customer) {
            return response()->json(['message' => 'Customer not found'], 404);
        }

        return response()->json($customer, 200);
    }



    //delete sub type
    public function subtypedestroy($id)
    {
        $customersubtype = CustomersubType::find($id);

        if (!$customersubtype) {
            return response()->json([
                'success' => false,
                'message' => 'Customer Sub Type not found!',
            ], 404);
        }

        $customersubtype->delete();

        return response()->json([
            'success' => true,
            'message' => 'Customer Sub Type deleted successfully!',
        ]);
    }

    public function Marriageanniversary(){
        $admin = JWTAuth::parseToken()->authenticate();
        return User::join('customers','customers.user_id','=','users.id')
        ->select('users.name','users.email','customers.phone','customers.dob','customers.anniversary','users.id')->where('created_by',$admin->id)->get();
    }

    public function sendBulkSms(Request $request)
{
    // Fetch customers
    $customers = User::join('customers', 'customers.user_id', '=', 'users.id')
        ->select('users.name', 'users.email', 'customers.phone', 'customers.dob', 'customers.anniversary')
        ->whereIn('users.id', $request->customer_ids)
        ->get();

    // SMS API Credentials
    $apiUrl = "https://sms.bluwaves.in/sendsms/bulk.php";
    $username = "ILCsoltechsolut";
    $password = "12345678";
    $sender = "STECHM";
    $entityId = "1701167282210491092";
    $templateId = "1707170488002410372";

    // Message template (example)
    $message = "Wishing you both a very Happy Marriage Anniversary!! May all your days be filled Love ,Joy and Happiness From Soltech Solution";

    // Collect all customer phone numbers in a comma-separated string
    $phoneNumbers = $customers->pluck('phone')->implode(',');


    // Send the bulk SMS request
    $response = Http::get($apiUrl, [
        'username' => $username,
        'password' => $password,
        'type' => 'TEXT',
        'sender' => $sender,
        'mobile' => $phoneNumbers,
        'message' => $message,
        'entityId' => $entityId,
        'templateId' => $templateId
    ]);
    // dd($response);
    // Return the response (for debugging)
    return response()->json(['response' => $response->body()]);
}


public function BirthdayWish(Request $request)
{
    // Fetch customers
    $customers = User::join('customers', 'customers.user_id', '=', 'users.id')
        ->select('users.name', 'users.email', 'customers.phone', 'customers.dob', 'customers.anniversary')
        ->whereIn('users.id', $request->customer_ids)
        ->get();

    // SMS API Credentials
    $apiUrl = "https://sms.bluwaves.in/sendsms/bulk.php";
    $username = "ILCsoltechsolut";
    $password = "12345678";
    $sender = "STECHM";
    $entityId = "1701167282210491092";
    $templateId = "1707169078649581280";

    // Message template (example)
    $message = "Wish you a very happy birthday. May each of your wishes come true. Many many happy returns of the day From Soltech Solution";

    // Collect all customer phone numbers in a comma-separated string
    $phoneNumbers = $customers->pluck('phone')->implode(',');


    // Send the bulk SMS request
    $response = Http::get($apiUrl, [
        'username' => $username,
        'password' => $password,
        'type' => 'TEXT',
        'sender' => $sender,
        'mobile' => $phoneNumbers,
        'message' => $message,
        'entityId' => $entityId,
        'templateId' => $templateId
    ]);
    // dd($response);
    // Return the response (for debugging)
    return response()->json(['response' => $response->body()]);
}

public function getCustomersWithTodayBirthday()
{
    $customer = JWTAuth::parseToken()->authenticate();


    $today = Carbon::today()->format('m-d'); // Get today's month and day (MM-DD format)
    // dd($today);
    $customers = Customer::join('users', 'users.id', '=', 'customers.user_id')
        ->select(
            'users.name',
            'users.id',
            'customers.dob',
            'customers.phone',
            'users.email',
            'customers.anniversary',
            'customers.gender',
            'customers.pincode',
            'customers.state',
            'customers.country',
            'customers.address'
        )
        ->where('customers.created_by', $customer->id)
        ->whereRaw("DATE_FORMAT(customers.dob, '%m-%d') = ?", [$today]) // Compare month and day
        ->get();

    return response()->json($customers, 200);
}

public function getUpcomingBirthdays($days = 7) // Default: Next 7 days
{
    $customer = JWTAuth::parseToken()->authenticate();

    $today = Carbon::today()->format('m-d'); // Today's month and day (MM-DD)
    $futureDate = Carbon::today()->addDays($days)->format('m-d'); // Future date (MM-DD)

    $customers = Customer::join('users', 'users.id', '=', 'customers.user_id')
        ->select(
            'users.name',
            'users.id',
            'customers.dob',
            'customers.phone',
            'users.email',
            'customers.anniversary',
            'customers.gender',
            'customers.pincode',
            'customers.state',
            'customers.country',
            'customers.address'
        )
        ->where('customers.created_by', $customer->id)
        ->whereRaw("DATE_FORMAT(customers.dob, '%m-%d') BETWEEN ? AND ?", [$today, $futureDate]) // Upcoming birthdays
        ->orderByRaw("DATE_FORMAT(customers.dob, '%m-%d')") // Sort by upcoming date
        ->get();

    return response()->json($customers, 200);
}



public function getCustomersWithTodayAnniversery()
{
    $customer = JWTAuth::parseToken()->authenticate();


    $today = Carbon::today()->format('m-d'); // Get today's month and day (MM-DD format)
    // dd($today);
    $customers = Customer::join('users', 'users.id', '=', 'customers.user_id')
        ->select(
            'users.name',
            'users.id',
            'customers.dob',
            'customers.phone',
            'users.email',
            'customers.anniversary',
            'customers.gender',
            'customers.pincode',
            'customers.state',
            'customers.country',
            'customers.address'
        )
        ->where('customers.created_by', $customer->id)
        ->whereRaw("DATE_FORMAT(customers.anniversary, '%m-%d') = ?", [$today]) // Compare month and day
        ->get();

    return response()->json($customers, 200);
}


public function getUpcomingAnnyvers($days = 7) // Default: Next 7 days
{
    $customer = JWTAuth::parseToken()->authenticate();

    $today = Carbon::today()->format('m-d'); // Today's month and day (MM-DD)
    $futureDate = Carbon::today()->addDays($days)->format('m-d'); // Future date (MM-DD)

    $customers = Customer::join('users', 'users.id', '=', 'customers.user_id')
        ->select(
            'users.name',
            'users.id',
            'customers.dob',
            'customers.phone',
            'users.email',
            'customers.anniversary',
            'customers.gender',
            'customers.pincode',
            'customers.state',
            'customers.country',
            'customers.address'
        )
        ->where('customers.created_by', $customer->id)
        ->whereRaw("DATE_FORMAT(customers.anniversary, '%m-%d') BETWEEN ? AND ?", [$today, $futureDate]) // Upcoming birthdays
        ->orderByRaw("DATE_FORMAT(customers.anniversary, '%m-%d')") // Sort by upcoming date
        ->get();

    return response()->json($customers, 200);
}

}
