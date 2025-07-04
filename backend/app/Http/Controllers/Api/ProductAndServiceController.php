<?php

namespace App\Http\Controllers\Api;
use App\Models\Barcode;
// Class App\Http\Controllers\Api\Storage;

use Illuminate\Http\Request;
use App\Models\ProductService;
use App\Exports\ItemListExport;
use Tymon\JWTAuth\Facades\JWTAuth;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Barryvdh\DomPDF\Facade\Pdf;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\Log;

class ProductAndServiceController extends Controller
{
    // public function index()
    // {
    //     $customer = JWTAuth::parseToken()->authenticate();
    //     $product=ProductService::join('rate_masters','rate_masters.id','=','product_services.rate_id')
    //     ->join('stocks','product_services.id','=','stocks.product_service_id')
    //     ->select("stocks.quantity",'product_services.name','product_services.image','rate_masters.rate','product_services.code','product_services.type','product_services.id','product_services.tax_rate','product_services.hsn','product_services.brand','product_services.description','product_services.pro_ser_type','product_services.expires')->where('created_by',$customer->id)->get();


    //     return response()->json($product);
    // }


    public function index()
{

    $customer = JWTAuth::parseToken()->authenticate();


    $products = ProductService::join('rate_masters', 'rate_masters.id', '=', 'product_services.rate_id')
        ->leftjoin('stocks', 'product_services.id', '=', 'stocks.product_service_id')
        //         ->join('stocks', 'product_services.id', '=', 'stocks.product_service_id')

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
            \DB::raw('SUM(stocks.quantity) as total_quantity')
        )
        ->where('product_services.created_by', $customer->id)
        ->groupBy(
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
            'product_services.expires'
        )
        ->get();

    return response()->json($products);
}

//saloon get
public function Saloonindex()
{

    $customer = JWTAuth::parseToken()->authenticate();


    $products = ProductService::join('rate_masters', 'rate_masters.id', '=', 'product_services.rate_id')
        ->leftjoin('stocks', 'product_services.id', '=', 'stocks.product_service_id')
        //         ->join('stocks', 'product_services.id', '=', 'stocks.product_service_id')

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
            \DB::raw('SUM(stocks.quantity) as total_quantity')
        )
        ->where('product_services.created_by', $customer->id)
        ->groupBy(
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
            'product_services.expires'
        )
        ->get();

    return response()->json($products);
}

//get product and service
public function productAndServiceGet()
{
    $customer = JWTAuth::parseToken()->authenticate();

    $products = ProductService::where('created_by', $customer->id)->get();

    return response()->json($products);
}


//saloon
public function productAndServiceGetFilterSaloon(Request $request)
{
    $customer = JWTAuth::parseToken()->authenticate();

    // Get the filter value from the query string
    $type = $request->query('pro_ser_type');

    // Start the query
    $query = ProductService::where('created_by', $customer->id);

    // Apply filter only if a specific type is passed
    if ($type && in_array($type, ['Product', 'Service'])) {
        $query->where('pro_ser_type', $type);
    }

    // Get the results
    $products = $query->get();

    return response()->json($products);
}


//get the service for saloon
public function getAllService()
{
    $customer = JWTAuth::parseToken()->authenticate();

    $products = ProductService::where('created_by', $customer->id)
                ->where('pro_ser_type', 'Service')
                ->get();

    return response()->json($products);
}


public function getAllProducts()
{
    $customer = JWTAuth::parseToken()->authenticate();

    $products = ProductService::where('created_by', $customer->id)
                ->where('pro_ser_type', 'Product')
                ->get();

    return response()->json($products);
}


//     public function store(Request $request)
// {
//     $customer = JWTAuth::parseToken()->authenticate();
//     \Log::info($customer);
//     $validated = $request->validate([
//         'name' => 'required|string',
//         'type' => 'nullable|string',
//         'code' => 'nullable|string|unique:product_services',
//         'company_id' => 'nullable|string',
//         'group_id' => 'nullable|string',
//         'rate_id' => 'nullable|string',
//         'tax_rate' => 'nullable|numeric',
//         'image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
//         'gram' => 'nullable|numeric',
//         'brand' => 'nullable|string',
//         'description' => 'nullable|string',
//         'rate' => 'nullable|numeric',
//         'pro_ser_type' => 'nullable|string',
//         'expires' => 'nullable|date',





//        // 'staff_commission' => 'nullable|numeric',
//         'hsn' => 'nullable|string',
//     ]);

//     // Authenticate the user
//     $customer = JWTAuth::parseToken()->authenticate();
//     $validated['created_by'] = $customer->id;

//     if ($request->hasFile('image')) {
//         $path = $request->file('image')->store('images', 'public');
//         $validated['image'] = $path;
//     }

//     // Use mass assignment with create
//     $productService = ProductService::create($validated);

//     return response()->json($productService, 201);
// }
public function store(Request $request)
{
    $customer = JWTAuth::parseToken()->authenticate();
    \Log::info($customer);
    $validated = $request->validate([
        'name' => 'required|string',
        'type' => 'nullable|string',
        'code' => 'nullable|string|unique:product_services',
        'company_id' => 'nullable|string',
        'group_id' => 'nullable|string',
        'rate_id' => 'nullable|string',
        'tax_rate' => 'nullable|numeric',
        'image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        'gram' => 'nullable|numeric',
        'brand' => 'nullable|string',
        'description' => 'nullable|string',
        'rate' => 'nullable|numeric',
        'pro_ser_type' => 'nullable|string',
        'expires' => 'nullable|date',





       // 'staff_commission' => 'nullable|numeric',
        'hsn' => 'nullable|string',
    ]);

    // Authenticate the user
    $customer = JWTAuth::parseToken()->authenticate();
    $validated['created_by'] = $customer->id;

    if ($request->hasFile('image')) {
        $path = $request->file('image')->store('images', 'public');
        $validated['image'] = $path;
    }

    // Use mass assignment with create
    $productService = ProductService::create($validated);

    return response()->json($productService, 201);
}


//saloon product service
public function Saloonstore(Request $request)
{
    $customer = JWTAuth::parseToken()->authenticate();
    \Log::info($customer);

    $data = $request->all();
    $data['created_by'] = $customer->id;

    if ($request->hasFile('image')) {
        $path = $request->file('image')->store('images', 'public');
        $data['image'] = $path;
    }

    // Use mass assignment with create
    $productService = ProductService::create($data);

    return response()->json($productService, 201);
}




public function update(Request $request, $id)
{
    // Find the product service by ID or fail with a 404
    $productService = ProductService::findOrFail($id);

    // Validate the request
    $validated = $request->validate([
        'name' => 'required|string',
        'type' => 'nullable|string',
        'code' => 'nullable|string|unique:product_services,code,' . $id, // Ensure 'code' is unique except for this record
        'company_id' => 'nullable|string',
        'group_id' => 'nullable|string',
        'tax_rate' => 'nullable|numeric',
        'rate_id' => 'nullable|string',
        'image' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        'gram' => 'nullable|numeric',
        'brand' => 'nullable|string',
        'description' => 'nullable|string',
        'rate' => 'nullable|numeric',
        'pro_ser_type' => 'nullable|string',
        'expires' => 'nullable|date',



       // 'staff_commission' => 'nullable|numeric',
        'hsn' => 'nullable|string',
    ]);

    // Check if a new image is uploaded
    if ($request->hasFile('image')) {
        // Delete the old image if it exists
        if ($productService->image && Storage::exists($productService->image)) {
            Storage::delete($productService->image);
        }

        // Store the new image
        $path = $request->file('image')->store('images', 'public');
        $validated['image'] = $path;
    }

    // Update the record
    $productService->update($validated);

    // Return the updated record as JSON
    return response()->json($productService, 200);
}

//saloon update product and service
// public function updateSalooanProduct(Request $request, $id)
// {
//     $productService = ProductService::findOrFail($id);

//     $validated = $request->validate([
//         'name' => 'sometimes|string',
//         'type' => 'sometimes|nullable|string',
//         'code' => 'sometimes|nullable|string|unique:product_services,code,' . $id,
//         'company_id' => 'sometimes|nullable|string',
//         'group_id' => 'sometimes|nullable|string',
//         'tax_rate' => 'sometimes|nullable|numeric',
//         'rate_id' => 'sometimes|nullable|string',
//         'image' => 'sometimes|image|mimes:jpeg,png,jpg|max:2048',
//         'gram' => 'sometimes|nullable|numeric',
//         'brand' => 'sometimes|nullable|string',
//         'description' => 'sometimes|nullable|string',
//         'rate' => 'sometimes|nullable|numeric',
//         'pro_ser_type' => 'sometimes|nullable|string',
//         'expires' => 'sometimes|nullable|date',
//         'hsn' => 'sometimes|nullable|string',
//         'staff_commission' => 'sometimes|nullable|numeric',
//         'mrp' => 'sometimes|nullable|numeric',
//         'rate_type' => 'sometimes|nullable|string',
//         'restro_rate' => 'sometimes|nullable|numeric',
//         'stock_maintain' => 'sometimes|nullable|boolean',
//     ]);

//     // Check for image file and handle separately
//     if ($request->hasFile('image')) {
//         if ($productService->image && Storage::exists($productService->image)) {
//             Storage::delete($productService->image);
//         }

//         $path = $request->file('image')->store('images', 'public');
//         $validated['image'] = $path;
//     }

//     // Filter out null or empty string fields (optional step)
//     $filtered = collect($validated)->filter(function ($value) {
//         return !is_null($value) && $value !== '';
//     })->toArray();

//     // Update with filtered data
//     $productService->update($filtered);

//     return response()->json([
//         'message' => 'Product updated successfully',
//         'data' => $productService
//     ], 200);
// }

public function updateSalooanProduct(Request $request, $id)
{
    $productService = ProductService::findOrFail($id);

    $data = $request->all();

    // Convert 'null' strings to actual null values (except 'image')
    foreach ($data as $key => $value) {
        if (($value === 'null' || $value === '') && $key !== 'image') {
            $data[$key] = null;
        }
    }

    // Handle image file separately
    if ($request->hasFile('image')) {
        // Delete old image if it exists
        if ($productService->image && Storage::disk('public')->exists($productService->image)) {
            Storage::disk('public')->delete($productService->image);
        }

        // Store new image
        $path = $request->file('image')->store('images', 'public');
        $data['image'] = $path;
    } else {
        // If no new image uploaded, remove 'image' from data to avoid setting it to null
        unset($data['image']);
    }

    // Update the product service
    $productService->update($data);

    return response()->json([
        'message' => 'Product updated successfully',
        'data' => $productService
    ], 200);
}




    public function destroy(ProductService $productService)
    {
        // Delete image
        if (File::exists(public_path($productService->image))) {
            File::delete(public_path($productService->image));
        }

        $productService->delete();
        return response()->json(['message' => 'Product Service deleted successfully.']);
    }


    public function barcodePrint(Request $request){
        $customer = JWTAuth::parseToken()->authenticate();

    // Search query from request
    $searchQuery = $request->input('search', '');

    // Fetch products created by the customer and filter by search query
    $product = ProductService::with('barcodes')->where('created_by', $customer->id)

                ->when($searchQuery, function ($query) use ($searchQuery) {
                    return $query->where('name', 'LIKE', "%{$searchQuery}%");
                                //  ->orWhere('barcode', 'LIKE', "%{$searchQuery}%")
                                //  ->orWhere('item_code', 'LIKE', "%{$searchQuery}%");
                })
                ->get();

    return response()->json($product);

    }


    public function getProductByBarcode(Request $request){
        $admin = JWTAuth::parseToken()->authenticate();
        // dd($admin);

        // Validate the barcode input
        $request->validate([
            'itemno' => 'required|string',
        ]);

        $barcode_no = $request->itemno;
        // dd($barcode_no);

        // Query the database for the product based on the barcode
        $product = Barcode::join('product_services', 'product_services.id', '=', 'barcodes.item_id')
            ->select('barcodes.barcode_no', 'barcodes.sku', 'barcodes.itemno', 'product_services.name', 'barcodes.id')
            ->where('barcodes.itemno', $barcode_no)
            ->where('barcodes.created_by', $admin->id)
            ->first(); // Use first() to get the single matching record

        if ($product) {
            return response()->json($product);
        } else {
            return response()->json(['message' => 'Product not found'], 404);
        }
    }
    public function show()
    {
        $productsAndServices = ProductService::all(); // Fetch all records
        return response()->json($productsAndServices);
    }

    public function report(Request $request)
    {
        try {
            $format = $request->query('format', 'pdf');
            $startDate = $request->query('start_date');
            $endDate = $request->query('end_date');

            // Fetch data from ProductService
            $query = ProductService::query();

            if ($startDate) {
                $query->whereDate('created_at', '>=', $startDate);
            }
            if ($endDate) {
                $query->whereDate('created_at', '<=', $endDate);
            }

            $details = $query->get();

            if ($details->isEmpty()) {
                return response()->json(['error' => 'No data found'], 404);
            }

            if ($format === 'pdf') {
                $html = $this->generateProductWisePDF($details);
                $pdf = Pdf::loadHTML($html);
                return response($pdf->output(), 200, [
                    'Content-Type' => 'application/pdf',
                    'Content-Disposition' => 'attachment; filename="ProductServiceReport.pdf"',
                ]);
            } elseif ($format === 'xlsx') {
                return Excel::download(new ItemListExport(), 'ProductServiceReport.xlsx');
            } else {
                return response()->json(['error' => 'Invalid format'], 400);
            }

        } catch (\Exception $e) {
            \Log::error('Report generation failed: ' . $e->getMessage());
            return response()->json(['error' => 'Report generation failed'], 500);
        }
    }

    private function generateProductWisePDF($details)
    {
        $html = '<html><head>
        <title>Product Service Report</title>
        <style>
            body { font-family: Arial, sans-serif; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid black; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
        </style>
        </head><body>
        <h2>Product Service Report</h2>
        <table>
            <tr>
                <th>ID</th>
                <th>Service Name</th>
                <th>Code</th>
                <th>Rate</th>
                <th>HSN</th>

            </tr>';

        foreach ($details as $detail) {
            $html .= "
            <tr>
                <td>{$detail->id}</td>
                <td>{$detail->name}</td>
                <td>{$detail->code}</td>
                <td>{$detail->rate}</td>
                <td>{$detail->hsn}</td>

            </tr>";
        }

        $html .= '</table></body></html>';

        return $html;
    }


}
