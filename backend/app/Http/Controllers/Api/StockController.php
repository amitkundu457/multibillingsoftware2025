<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Stock;
use Illuminate\Http\Request;
 use Illuminate\Support\Facades\Validator;
 use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Log;
use Exception;

class StockController extends Controller
{
    // public function index(){
    //     $customer = JWTAuth::parseToken()->authenticate();
    // Log::info('Authenticated Customer:', ['customer' => $customer]);


    //     $stock = Stock::with('product_service')->get();
    //     return \response()->json(['stock'=>$stock]);
    // }
    public function index()
{
    $customer = JWTAuth::parseToken()->authenticate();
    Log::info('Authenticated Customer:', ['customer' => $customer]);

    $stock = Stock::with('product_service')
        ->where('created_by', $customer->id)
        ->get();

    return response()->json(['stock' => $stock]);
}


    public function show($id){
        $stock = Stock::with('product_service')->findOrFail($id);
        return \response()->json(['stock'=>$stock]);
    }

    // public function store(Request $request){
    //     $validated = $request->validate([
    //         'product_service_id'=>'required',
    //         'quantity'=>'required',
    //         'gross_weight'=>'required',
    //         'net_weight'=>'required',
    //         'rate'=>'nullable',
    //         'mrp'=>'nullable',
    //         'date'=>'nullable'
    //     ]);

    //     Stock::create($validated);
    //     return \response()->json(['message'=>'Stock created successfully!']);
    // }
//     public function store(Request $request)
// {
//     $customer = JWTAuth::parseToken()->authenticate();
//     Log::info('Authenticated Customer:', ['customer' => $customer]);

//     $validated = $request->validate([
//         'product_service_id' => 'required',
//         'quantity' => 'required',
//         'gross_weight' => 'required',
//         'net_weight' => 'required',
//         'rate' => 'nullable',
//         'mrp' => 'nullable',
//         'date' => 'nullable'
//     ]);

//     $stock = Stock::create([
//         ...$validated,
//         'created_by' => $customer->id
//     ]);

//     return response()->json([
//         'message' => 'Stock created successfully!',
//         'data' => $stock
//     ]);
// }


public function store(Request $request)
{
    $customer = JWTAuth::parseToken()->authenticate();
    Log::info('Authenticated Customer:', ['customer' => $customer]);

    $validated = $request->validate([
        'product_service_id' => 'nullable',
        'quantity' => 'nullable',
        'gross_weight' => 'nullable',
        'net_weight' => 'nullable',
        'rate' => 'nullable',
        'mrp' => 'nullable',
        'date' => 'nullable'
    ]);

    $stock = Stock::create([
        ...$validated,
        'created_by' => $customer->id
    ]);

    return response()->json([
        'message' => 'Stock created successfully!',
        'data' => $stock
    ]);
}


   

//updated 



// public function uploadCSV(Request $request)
// {
//     $customer = JWTAuth::parseToken()->authenticate();
//     Log::info('Authenticated Customer:', ['customer' => $customer]);

//     $request->validate([
//         'csv_file' => 'required|file|mimes:csv,txt',
//     ]);

//     $file = $request->file('csv_file');
//     $data = array_map('str_getcsv', file($file->getRealPath()));

//     // Remove and normalize header
//     $header = array_map('trim', array_shift($data));

//     $requiredColumns = ['product_service_id', 'quantity', 'gross_weight', 'net_weight'];
//     foreach ($requiredColumns as $column) {
//         if (!in_array($column, $header)) {
//             return response()->json([
//                 'error' => "Missing required column: $column"
//             ], 422);
//         }
//     }

//     $stocks = [];

//     foreach ($data as $rowIndex => $row) {
//         $row = array_map('trim', $row);
//         $rowData = array_combine($header, $row);

//         // Convert empty strings to null or default values
//         foreach ($rowData as $key => $value) {
//             if ($value === '') {
//                 // Set adj_status to 0 if empty, otherwise null
//                 $rowData[$key] = ($key === 'adj_status') ? 0 : null;
//             }
//         }

//         // Validate
//         $validator = Validator::make($rowData, [
//             'product_service_id' => 'required|integer',
//             'quantity' => 'required|numeric',
//             'gross_weight' => 'required|numeric',
//             'net_weight' => 'required|numeric',
//             'rate' => 'nullable|numeric',
//             'mrp' => 'nullable|numeric',
//             'date' => 'nullable|date',
//             'adj_status' => 'nullable|integer',
//         ]);

//         if ($validator->fails()) {
//             return response()->json([
//                 'error' => "Validation failed on row " . ($rowIndex + 2),
//                 'details' => $validator->errors()
//             ], 422);
//         }

//         $rowData['created_by'] = $customer->id;
//         $stocks[] = $rowData;
//     }

//     // Bulk insert
//     Stock::insert($stocks);

//     return response()->json([
//         'message' => count($stocks) . ' stock items created successfully!',
//         'data' => $stocks
//     ]);
// }


public function uploadCSV(Request $request)
{
    $customer = JWTAuth::parseToken()->authenticate();
    Log::info('Authenticated Customer:', ['customer' => $customer]);

    // Still validate that a file was uploaded
    $request->validate([
        'csv_file' => 'required|file|mimes:csv,txt',
    ]);

    $file = $request->file('csv_file');
    $data = array_map('str_getcsv', file($file->getRealPath()));

    // Remove and normalize header
    $header = array_map('trim', array_shift($data));

    // ❌ Removed required column check
    // $requiredColumns = ['product_service_id', 'quantity', 'gross_weight', 'net_weight'];
    // foreach ($requiredColumns as $column) {
    //     if (!in_array($column, $header)) {
    //         return response()->json([
    //             'error' => "Missing required column: $column"
    //         ], 422);
    //     }
    // }

    $stocks = [];

    foreach ($data as $rowIndex => $row) {
        $row = array_map('trim', $row);
        $rowData = array_combine($header, $row);

        // Convert empty strings to null or default values
        foreach ($rowData as $key => $value) {
            if ($value === '') {
                $rowData[$key] = ($key === 'adj_status') ? 0 : null;
            }
        }

        // ✅ Validation with all fields nullable
        $validator = Validator::make($rowData, [
            'product_service_id' => 'nullable|integer',
            'quantity' => 'nullable|numeric',
            'gross_weight' => 'nullable|numeric',
            'net_weight' => 'nullable|numeric',
            'rate' => 'nullable|numeric',
            'mrp' => 'nullable|numeric',
            'date' => 'nullable|date',
            'adj_status' => 'nullable|integer',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => "Validation failed on row " . ($rowIndex + 2),
                'details' => $validator->errors()
            ], 422);
        }

        $rowData['created_by'] = $customer->id;
        $stocks[] = $rowData;
    }

    // Bulk insert
    Stock::insert($stocks);

    return response()->json([
        'message' => count($stocks) . ' stock items created successfully!',
        'data' => $stocks
    ]);
}


//delete meatho
public function destroy($id)
{
    $stock = Stock::find($id);

    if (!$stock) {
        return response()->json(['message' => 'Stock not found'], 404);
    }

    $stock->delete();

    return response()->json(['message' => 'Stock deleted successfully']);
}



//     public function deleteAllStock()
// {

//      // Count the total number of records before deletion
//      $totalRecords = Stock::count();

//      if ($totalRecords === 0) {
//          return response()->json(['message' => 'No records found to delete'], 404);
//      }

//     Stock::truncate(); //
//     return response()->json(['message' => 'All stock records deleted'], 200);
// }
public function deleteAllStock()
{
    $customer = JWTAuth::parseToken()->authenticate();
    Log::info('Authenticated Customer:', ['customer' => $customer]);

    // Count records for the current user
    $userStockCount = Stock::where('created_by', $customer->id)->count();

    if ($userStockCount === 0) {
        return response()->json(['message' => 'No records found to delete'], 404);
    }

    // Delete records only for the authenticated user
    Stock::where('created_by', $customer->id)->delete();

    return response()->json(['message' => 'All your stock records have been deleted'], 200);
}


    public function adjust(){
        $stock = Stock::with('product_service')
        ->whereNotNull('date') // More semantic than '!= null'
        ->get();
        return \response()->json(['stock'=>$stock]);
    }


    public function downloadSampleStock()
{
    $headers = [
        "Content-type" => "text/csv",
        "Content-Disposition" => "attachment; filename=sample_stock.csv",
        "Pragma" => "no-cache",
        "Expires" => "0"
    ];

    $columns = ['product_service_id', 'quantity', 'gross_weight', 'net_weight', 'rate','mrp','date','adj_status']; // Adjust columns as per your database table

    $callback = function() use ($columns) {
        $file = fopen('php://output', 'w');
        fputcsv($file, $columns); // Writing headers
        fclose($file);
    };

    return response()->stream($callback, 200, $headers);
}

}
