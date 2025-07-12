<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\PackageItem;
use App\Models\Package;
use App\Models\Customer;
use App\Models\PackageAssign;
use App\Models\PackageGroup;
use App\Models\PackageName;
use App\Models\PackageServiceType;
use App\Models\User;
use App\Models\PackageSubtype;
use App\Models\PackageTyp;
use App\Models\Tax;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use App\Models\PackageServiceName;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;
class PackageController extends Controller
{
    public function index() {
        // Fetch all packages from the database
        $user=JWTAuth::parseToken()->authenticate();
        $packages = Package::where('created_by',$user->id)->get();

        // Return the packages as JSON response
        return response()->json($packages);
    }
    
//     public function store(Request $request)
//     {
//         $user=JWTAuth::parseToken()->authenticate();
//         Log::info('Full request', ['request' => $request->all()]);
//         Log::info('user request',$request->services);

//         $package = Package::create([
//             'name' => $request->name,
//             'type_id' => $request->type_id,
//            'subtype_id' => $request-> subtype_id,
//             'price' => $request->price,
//             'tax_id' => $request->tax_id,
//             'tax_type_id' => $request->tax_type_id,
//             'hsn' => $request->hsn,
//             'group_id' => $request->group_id,
//             'category_id' => $request->category_id,
//            'service_type_id' => $request->service_type_id,
//            'pa_name_id' => $request->pa_name_id,
//             'created_by' =>  $user->id,
//             //'nos' => $request->nos,

//         ]);

// Log::info('pageake',['package' => $package]);
//         foreach ($package as $service) {
//             PackageServiceName::create([
//                 'package_id' => $package->id, // Use newly created package ID
//                 'service_name' => $service['service_name'],
//                 'price' => $service['price'],
//                 'quantity' => $service['quantity'],
//             ]);
//         }
//         // if (is_array($request->services)) {
//         //     foreach ($request->services as $service) {
//         //         PackageServiceName::create([
//         //             'package_id' => $package->id,
//         //             'service_name' => $service['service_name'],
//         //             'price' => $service['price'],
//         //             'quantity' => $service['quantity'],
//         //         ]);
//         //     }
//         // }
        

//         return response()->json($package, 201);
//     }




public function store(Request $request)
{
    $user = JWTAuth::parseToken()->authenticate();

    Log::info('Full request', ['request' => $request->all()]);
    Log::info('User services', ['services' => $request->services]);

    $package = Package::create([
        'name' => $request->name,
        'type_id' => $request->type_id,
        'subtype_id' => $request->subtype_id,
        'price' => $request->price,
        'tax_id' => $request->tax_id,
        'tax_type_id' => $request->tax_type_id,
        'hsn' => $request->hsn,
        'group_id' => $request->group_id,
        'category_id' => $request->category_id,
        'service_type_id' => $request->service_type_id,
        'pa_name_id' => $request->pa_name_id,
        'created_by' => $user->id,
    ]);

    Log::info('Package created', ['package' => $package]);

    if (is_array($request->services)) {
        foreach ($request->services as $service) {
            PackageServiceName::create([
                'package_id' => $package->id,
                'service_name' => $service['service_name'],
                'price' => $service['price'],
                'quantity' => $service['quantity'],
            ]);
        }
    }

    return response()->json($package, 201);
}


    // Fetch a single package
    public function show($id)
    {
        $package = Package::find($id);
        if (!$package) {
            return response()->json(['message' => 'Package not found'], 404);
        }
        return response()->json($package);
    }

    // Update package
    public function update(Request $request, $id)
    {
        $package = Package::find($id);
        if (!$package) {
            return response()->json(['message' => 'Package not found'], 404);
        }

        $package->update($request->all());

        return response()->json($package);
    }

    // Delete package
    public function destroy($id)
    {
        $package = Package::find($id);
        if (!$package) {
            return response()->json(['message' => 'Package not found'], 404);
        }

        $package->delete();
        return response()->json(['message' => 'Package deleted successfully']);
    }


    // Get all subtypes
    public function Subindex()
    {
        return response()->json(PackageSubtype::all());
    }

    // Create a new subtype
    public function Substore(Request $request)
    {
        $request->validate([
            'name' => 'required',
        ]);

        $subtype = PackageSubtype::create($request->all());
        return response()->json(['message' => 'Subtype created successfully', 'data' => $subtype], 201);
    }

    // Get a single subtype
    public function Subshow($id)
    {
        $subtype = PackageSubtype::find($id);
        if (!$subtype) {
            return response()->json(['message' => 'Subtype not found'], 404);
        }
        return response()->json($subtype);
    }

    // Update a subtype
    public function Subupdate(Request $request, $id)
    {
        $subtype = PackageSubtype::find($id);
        if (!$subtype) {
            return response()->json(['message' => 'Subtype not found'], 404);
        }

        $request->validate([
            'name' => 'required|string|max:255|unique:package_subtypes,name,' . $id,
        ]);

        $subtype->update($request->all());
        return response()->json(['message' => 'Subtype updated successfully', 'data' => $subtype]);
    }

    // Delete a subtype
    public function Subdestroy($id)
    {
        $subtype = PackageSubtype::find($id);
        if (!$subtype) {
            return response()->json(['message' => 'Subtype not found'], 404);
        }

        $subtype->delete();
        return response()->json(['message' => 'Subtype deleted successfully']);
    }








    public function Groupindex()
    {
        return response()->json(PackageGroup::all());
    }

    // Create a new subtype
    public function Groupstore(Request $request)
    {
        $request->validate([
            'name' => 'required',
        ]);

        $subtype = PackageGroup::create($request->all());
        return response()->json(['message' => 'Subtype created successfully', 'data' => $subtype], 201);
    }

    // Get a single subtype
    public function Groupshow($id)
    {
        $subtype = PackageGroup::find($id);
        if (!$subtype) {
            return response()->json(['message' => 'Subtype not found'], 404);
        }
        return response()->json($subtype);
    }

    // Update a subtype
    public function Groupupdate(Request $request, $id)
    {
        $subtype = PackageGroup::find($id);
        if (!$subtype) {
            return response()->json(['message' => 'Subtype not found'], 404);
        }

        $request->validate([
            'name' => 'required|string|max:255|unique:package_subtypes,name,' . $id,
        ]);

        $subtype->update($request->all());
        return response()->json(['message' => 'Subtype updated successfully', 'data' => $subtype]);
    }

    // Delete a subtype
    public function Groupdestroy($id)
    {
        $subtype = PackageGroup::find($id);
        if (!$subtype) {
            return response()->json(['message' => 'Subtype not found'], 404);
        }

        $subtype->delete();
        return response()->json(['message' => 'Subtype deleted successfully']);
    }




    // public function Categoryindex()
    // {
    //     $customer = JWTAuth::parseToken()->authenticate();
    // Log::info('Authenticated Customer:', ['customer' => $customer]);

    // $category=Category::where("crated_by",$customer->id)->get();

    // return response()->json($category);
    //     // return response()->json(Category::all());
    // }

    public function Categoryindex()
{
    $customer = JWTAuth::parseToken()->authenticate();
    Log::info('Authenticated Customer:', ['customer' => $customer]);

    // Filter by created_by
    $categories = Category::where('created_by', $customer->id)->get();

    return response()->json($categories);
}

    // Create a new subtype
    // public function Categorystore(Request $request)
    // {
    //     $customer = JWTAuth::parseToken()->authenticate();
    // Log::info('Authenticated Customer:', ['customer' => $customer]);


    //     $request->validate([
    //         'name' => 'required',
    //         'created_by'=>$customer->id,
    //     ]);

    //     $subtype = Category::create($request->all());
    //     return response()->json(['message' => 'Subtype created successfully', 'data' => $subtype], 201);
    // }

    public function Categorystore(Request $request)
{
    $customer = JWTAuth::parseToken()->authenticate();
    Log::info('Authenticated Customer:', ['customer' => $customer]);

    $request->validate([
        'name' => 'required',
    ]);

    $subtype = Category::create([
        'name' => $request->name,
        'created_by' => $customer->id,
    ]);

    return response()->json([
        'message' => 'Subtype created successfully',
        'data' => $subtype
    ], 201);
}


    // Get a single subtype
    public function Categoryshow($id)
    {
        $subtype = Category::find($id);
        if (!$subtype) {
            return response()->json(['message' => 'Subtype not found'], 404);
        }
        return response()->json($subtype);
    }

    // Update a subtype
    public function Categoryupdate(Request $request, $id)
    {
        $subtype = Category::find($id);
        if (!$subtype) {
            return response()->json(['message' => 'Subtype not found'], 404);
        }

        $request->validate([
            'name' => 'required|string|max:255|unique:package_subtypes,name,' . $id,
        ]);

        $subtype->update($request->all());
        return response()->json(['message' => 'Subtype updated successfully', 'data' => $subtype]);
    }

    // Delete a subtype
    public function Categorydestroy($id)
    {
        $subtype = Category::find($id);
        if (!$subtype) {
            return response()->json(['message' => 'Subtype not found'], 404);
        }

        $subtype->delete();
        return response()->json(['message' => 'Subtype deleted successfully']);
    }

    public function packageserviceType(){
        return PackageServiceType::all();
    }

    public function PackageType(){
        return PackageTyp::all();
    }

    public function tax(){
        return Tax::all();
    }





    // public function packagenameindex()
    // {
    //     return response()->json(PackageName::all());
    // }

   

public function packagenameindex()
{
    $user = JWTAuth::parseToken()->authenticate();

    $packages = PackageName::where('created_by', $user->id)->get();

    return response()->json($packages);
}

    // Create a new subtype
    // public function packagenamestore(Request $request)
    // {
    //     $request->validate([
    //         'name' => 'required',
    //     ]);

    //     $subtype = PackageName::create($request->all());
    //     return response()->json(['message' => 'Subtype created successfully', 'data' => $subtype], 201);
    // }



// public function packagenamestore(Request $request)
// {
//     $user = JWTAuth::parseToken()->authenticate();

//     $request->validate([
//         'name' => 'required',
//     ]);

//     $data = $request->only(['name']);
//     $data['created_by'] = $user->id;

//     $subtype = PackageName::create($data);

//     return response()->json([
//         'message' => 'pakagename created successfully',
//         'data' => $subtype
//     ], 201);
// }
public function packagenamestore(Request $request)
{
    $user = JWTAuth::parseToken()->authenticate();

    $request->validate([
        'name' => 'required|string|max:255',
        'price' => 'required|numeric|min:0',
        'expires_after_months' => 'required|integer|min:1',
    ]);

    $data = $request->only(['name', 'price', 'expires_after_months']);
    $data['created_by'] = $user->id;

    $subtype = PackageName::create($data);

    return response()->json([
        'message' => 'Package name created successfully',
        'data' => $subtype
    ], 201);
}


    // Get a single subtype
    public function packagenameshow($id)
    {
        $subtype = PackageName::find($id);
        if (!$subtype) {
            return response()->json(['message' => 'Subtype not found'], 404);
        }
        return response()->json($subtype);
    }

    // Update a subtype
    // public function packagenameupdate(Request $request, $id)
    // {
    //     $subtype = PackageName::find($id);
    //     if (!$subtype) {
    //         return response()->json(['message' => 'Subtype not found'], 404);
    //     }

    //     $request->validate([
    //         'name' => 'required|string|max:255|unique:package_subtypes,name,' . $id,
    //     ]);

    //     $subtype->update($request->all());
    //     return response()->json(['message' => 'Subtype updated successfully', 'data' => $subtype]);
    // }
//new code of pakage 

// public function newPakageStore(Request $request)
// {
//     $user = JWTAuth::parseToken()->authenticate();

//     $validated = $request->validate([
//         'name' => 'required|string',
//         'price' => 'required|numeric',
//         'expires_after_months' => 'required|integer',
//         'service_items' => 'required|array',
//         'service_items.*.service_name' => 'required|string',
//         'service_items.*.total_quantity' => 'required|integer',
//         'product_items' => 'required|array',
//         'product_items.*.product_name' => 'required|string',
//         'product_items.*.total_quantity' => 'required|integer',
//     ]);

//     $package = PackageName::create([
//         'name' => $request->name,
//         'price' => $request->price,
//         'expires_after_months' => $request->expires_after_months,
//         'created_by' => $user->id,
//     ]);

//     // Save service items
//     foreach ($request->service_items as $item) {
//         $package->items()->create([
//             'service_name' => $item['service_name'],
//             'total_quantity' => $item['total_quantity'],
//             'type' => 'service',
//         ]);
//     }

//     // Save product items
//     foreach ($request->product_items as $item) {
//         $package->items()->create([
//             'service_name' => $item['product_name'],
//             'total_quantity' => $item['total_quantity'],
//             'type' => 'product',
//         ]);
//     }

//     return response()->json([
//         'message' => 'Package created successfully',
//         'package' => $package->load('items')
//     ]);
// }


public function newPakageStore(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();
Log::info('Full request', ['request' => $request->all()]);
        $package = PackageName::create([
            'name' => $request->name,
            'price' => $request->price,
            'expires_after_months' => $request->expires_after_months,
            'created_by' => $user->id,
            'totalPackageAmount'=> $request->totalPackageAmount, // Assuming this is a field in your PackageName model
        ]);

        // Save service items
        // if (!empty($request->service_items)) {
        //     foreach ($request->service_items as $item) {
        //         $package->items()->create([
        //             'service_name' => $item['service_name'],
        //             'total_quantity' => $item['total_quantity'],
        //             'type' => 'service',
        //         ]);
        //     }
        // }

        // Save service items
if (!empty($request->service_items)) {
    foreach ($request->service_items as $item) {
        if (!empty($item['service_name']) && !empty($item['total_quantity'])) {
            $package->items()->create([
                'service_name' => $item['service_name'],
                'total_quantity' => $item['total_quantity'],
                'type' => 'service',
            ]);
        }
    }
}

        // Save product items
        // if (!empty($request->product_items)) {
        //     foreach ($request->product_items as $item) {
        //         $package->items()->create([
        //             'service_name' => $item['product_name'],
        //             'total_quantity' => $item['total_quantity'],
        //             'type' => 'product',
        //         ]);
        //     }
        // }
        // Save product items
if (!empty($request->product_items)) {
    foreach ($request->product_items as $item) {
        if (!empty($item['product_name']) && !empty($item['total_quantity'])) {
            $package->items()->create([
                'service_name' => $item['product_name'],
                'total_quantity' => $item['total_quantity'],
                'type' => 'product',
            ]);
        }
    }
}


        return response()->json([
            'message' => 'Package created successfully',
            'package' => $package->load('items')
        ]);
    }



public function newPakageindex()
    {
        return PackageName::with('items')->get();
    }







    public function packagenameupdate(Request $request, $id)
    {
        $subtype = PackageName::find($id);
        if (!$subtype) {
            return response()->json(['message' => 'Subtype not found'], 404);
        }
    
        $subtype->update([
            'name' => $request->name,
            'price' => $request->price,
            'expires_after_months' => $request->expires_after_months,
        ]);
    
        return response()->json([
            'message' => 'Subtype updated successfully',
            'data' => $subtype
        ]);
    }
    


    // Delete a subtype
    // public function packagenamedestroy($id)
    // {
    //     $subtype = PackageName::find($id);
    //     if (!$subtype) {
    //         return response()->json(['message' => 'Subtype not found'], 404);
    //     }

    //     $subtype->delete();
    //     return response()->json(['message' => 'Subtype deleted successfully']);
    // }

    public function packagenamedestroy($id)
{
    $subtype = PackageName::find($id);

    if (!$subtype) {
        return response()->json(['message' => 'Package name not found'], 404);
    }

    $subtype->delete();

    return response()->json([
        'message' => 'Package name deleted successfully'
    ], 200);
}


public function newpackagenamedestroy($id)
    {
        $package = PackageName::findOrFail($id);
        $package->delete();

        return response()->json(['message' => 'Package deleted']);
    }



   //pakage update controller get and update 
public function pacakgeGetAll($packageId)
{
    $items = PackageItem::where('package_name_id', $packageId)->get();
    return response()->json($items);
}

public function updateUsage(Request $request)
{
    $request->validate([
        'items' => 'required|array',
        'items.*.id' => 'required|exists:package_items,id',
        'items.*.todayuse' => 'required|integer|min:0',
    ]);

    foreach ($request->items as $itemData) {
        $item = PackageItem::find($itemData['id']);
        $item->todayuse = $itemData['todayuse'];
        $item->used = ($item->used ?? 0) + $itemData['todayuse'];
        $item->save();
    }

    return response()->json(['message' => 'Usage updated successfully']);
}


//get package item ,assign package details  by customer phone

// public function packageGetAlls($customerId)
// {
//     // Find the assigned package for the customer
//     $assignedPackage = PackageAssign::where('customer_id', $customerId)->first();

//     if (!$assignedPackage) {
//         return response()->json([], 404); // Not found
//     }

//     // Get all items from the package
//     $items = PackageItem::where('package_name_id', $assignedPackage->package_id)->get();

//     return response()->json([
//         'package' => $assignedPackage,
//         'items' => $items
//     ]);
// }

// public function packageGetAllByPhone($phone)
// {
//     // Find the customer by phone number
//     $customer = Customer::where('phone', $phone)->first();

//     if (!$customer) {
//         return response()->json(['message' => 'Customer not found'], 404);
//     }
// // dd($customer);
//     // Find the assigned package for the customer
//     $customerInfor = User::where('id', $customer->user_id)->first();

//     $assignedPackage = PackageAssign::where('customer_id', $customer->user_id)->get();

//     if (!$assignedPackage) {
//         return response()->json(['message' => 'Package not assigned to this customer'], 404);
//     }

//     // Get all items from the package
//     $items = PackageItem::where('package_name_id', $assignedPackage->package_id)->get();

//     return response()->json([
//         'customer' => $customer,
//         'customer_info' => $customerInfor,
//         'package' => $assignedPackage,
        
//         'items' => $items
//     ]);
// }


//print packake when assin to customer
// public function getPackageDetailsByAssignId($assignId)
// {
//     // Find the PackageAssign by its ID
//     $assignedPackage = PackageAssign::find($assignId);

//     if (!$assignedPackage) {
//         return response()->json(['message' => 'Assigned package not found'], 404);
//     }

//     // Get the package ID from the assignment
//     $packageId = $assignedPackage->package_id;

//     // Find the package to get package_name_id
//     $package = PackageName::find($packageId); // Assuming you have a Package model

//     if (!$package) {
//         return response()->json(['message' => 'Package not found'], 404);
//     }

//     // Get the items using package_name_id from the Package model
//     $items = PackageItem::where('package_name_id',  $packageId)->get();

//     return response()->json([
//         'assigned_package' => $assignedPackage,
//         'package' => $package,
//         'items' => $items
//     ]);
// }

public function getPackageDetailsByAssignId($assignId)
{
    // Find the PackageAssign by its ID
    $assignedPackage = PackageAssign::find($assignId);

    if (!$assignedPackage) {
        return response()->json(['message' => 'Assigned package not found'], 404);
    }

    // Get the package ID from the assignment
    $packageId = $assignedPackage->package_id;

    // Find the package name (PackageName model)
    $package = PackageName::find($packageId); // Assuming 'PackageName' is the model for package names

    if (!$package) {
        return response()->json(['message' => 'Package not found'], 404);
    }

    // Find the customer info using customer_id from PackageAssign
    $customer = Customer::where('user_id', $assignedPackage->customer_id)->first();
// Get customer info (e.g., user details)
$customerInfo = User::find($customer->user_id);
    // Get the items using package_name_id from PackageName
    $items = PackageItem::where('package_name_id', $packageId)->get();

    return response()->json([
        'assigned_package' => $assignedPackage,
        'package' => $package,
        'items' => $items,
        'customer' => $customer,
        'customer_info' => $customerInfo,
    ]);
}




public function packageGetAllByPhone($phone)
{
    // Find the customer by phone number
    $customer = Customer::where('phone', $phone)->first();

    if (!$customer) {
        return response()->json(['message' => 'Customer not found'], 404);
    }

    // Get customer info (e.g., user details)
    $customerInfo = User::find($customer->user_id);

    // Get all assigned packages for this customer
    $assignedPackages = PackageAssign::where('customer_id', $customer->user_id)->get();

    if ($assignedPackages->isEmpty()) {
        return response()->json(['message' => 'No packages assigned to this customer'], 404);
    }

    // Collect all packages and their items
    $packagesWithItems = $assignedPackages->map(function ($pkg) {
        $items = PackageItem::where('package_name_id', $pkg->package_id)->get();
        return [
            'package' => $pkg,
            'items' => $items
        ];
    });

    // Return full data
    return response()->json([
        'customer' => $customer,
        'customer_info' => $customerInfo,
        'packages' => $packagesWithItems
    ]);
}








//pakcage report api 
public function getCustomerPackages()
{
    try {
        // Get the authenticated customer (User model)
        $customer = JWTAuth::parseToken()->authenticate();

        // Get PackageAssign records where 'created_by' matches the authenticated customer's ID
        $assignedPackages = PackageAssign::with([
            'services',     // Services in the package
            'package',      // Package details
            'customer',     // Customer model
            'users'         // User info
        ])
        ->where('created_by', $customer->id)
        ->get();

        return response()->json([
            'customer' => $customer,
            'assigned_packages' => $assignedPackages,
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Failed to fetch packages',
            'error' => $e->getMessage(),
        ], 500);
    }
}

// $apiKey = 'AIzaSyDUkrUcRP95h80YihCAkjFhrv_yqtOD1Tc';

//tnaslate
// public function translate(Request $request)
//     {
//         $text = $request->input('text');
//         $target = $request->input('target'); // e.g. 'hi' or 'en'

//         if (!$text || !$target) {
//             return response()->json(['error' => 'Text and target language required.'], 400);
//         }

//         $apiKey = 'AIzaSyDUkrUcRP95h80YihCAkjFhrv_yqtOD1Tc';

//         $response = Http::get('https://translation.googleapis.com/language/translate/v2', [
//             'q' => $text,
//             'target' => $target,
//             'format' => 'text',
//             'key' => $apiKey,
//         ]);

//         return response()->json($response->json());
//     }

// public function translate(Request $request)
// {
//     $texts = $request->input('text'); // expect array
//     $target = $request->input('target');

//     if (!$texts || !$target) {
//         return response()->json([
//             'error' => 'Text and target language required.'
//         ], 400);
//     }

//     $translations = [];

//     foreach ($texts as $text) {
//         $response = Http::get('https://translation.googleapis.com/language/translate/v2', [
//             'q' => $text,
//             'target' => $target,
//             'format' => 'text',
//             'key' => 'AIzaSyDUkrUcRP95h80YihCAkjFhrv_yqtOD1Tc',
//         ]);

//         $translatedText = $response['data']['translations'][0]['translatedText'];
//         $translations[] = $translatedText;
//     }

//     return response()->json(['data' => $translations]);
// }

public function translate(Request $request)
{
    $texts = $request->input('text'); // should be array
    $target = $request->input('target');

    if (!$texts || !$target) {
        return response()->json([
            'error' => 'Text and target language required.'
        ], 400);
    }

    // 💡 If $texts is a string, try decoding it
    if (is_string($texts)) {
        $decoded = json_decode($texts, true);
        if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
            $texts = $decoded;
        } else {
            // Fallback: make it an array of one string
            $texts = [$texts];
        }
    }

    $translations = [];

    foreach ($texts as $text) {
        $response = Http::get('https://translation.googleapis.com/language/translate/v2', [
            'q' => $text,
            'target' => $target,
            'format' => 'text',
            'key' => 'AIzaSyDUkrUcRP95h80YihCAkjFhrv_yqtOD1Tc',
        ]);

        $translatedText = $response['data']['translations'][0]['translatedText'] ?? '';
        $translations[] = $translatedText;
    }

    return response()->json(['data' => $translations]);
}

}



