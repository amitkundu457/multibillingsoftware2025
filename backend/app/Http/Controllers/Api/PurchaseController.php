<?php

namespace App\Http\Controllers\Api;

use App\Models\Purchase;
use App\Models\KarigariItem;
use App\Models\PurchaseItem;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Excel;
use App\Models\ProductService;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Facades\JWTAuth;


class PurchaseController extends Controller
{
    public function index()
    {
        $customer = JWTAuth::parseToken()->authenticate();

        $pur = Purchase::with(['purchase_items','user'])
        ->where('created_by', $customer->id)
        ->get();
        return \response()->json(['purchase'=>$pur]);
    }

    public function store(Request $request)
    {
        $customer = JWTAuth::parseToken()->authenticate();

        $validate = $request->validate([
            'voucher_no' => 'required',
            'date' => 'required',
            'bill_no' => 'required',
            'is_igst' => 'nullable',
            'user_id' => 'nullable',
            'payment_mode' => 'required',
            'credit_days' => 'required',
            'discount'=>'nullable',
            'addition'=>'nullable',
            'credit_note'=>'nullable',
        ]);
        $validate['created_by'] = $customer->id; // Set user_id from authenticated customer

        $pr = Purchase::create($validate);
        foreach ($request->purchase_items as $item) {
            PurchaseItem::create([
                'purchase_id'       => $pr->id,
                'product_name' => $item['product_name'],
                'product_service_id' => $item['product_service_id'],
                'pcs'               => $item['pcs'],
                'gwt'               => $item['gwt'],
                'nwt'               => $item['nwt'],
                'rate'              => $item['rate'],
                'other_chg'         => $item['other_chg'],
                'disc'              => $item['disc'],
                'disc_percent'      => $item['disc_percent'],
                'gst'               => $item['gst'],
                'taxable'           => $item['taxable'],
                'total_gst'         => $item['total_gst'],
                'net_amount'        => $item['net_amount'],
            ]);
        }

        return \response()->json(['message'=>'Purchase create successful']);;
    }


    
    public function update(Request $request,$id)
    {
        $validate = $request->validate([
            'voucher_no' => 'required',
            'date' => 'required',
            'bill_no' => 'required',
            'is_igst' => 'nullable',
            'user_id' => 'nullable',
            'payment_mode' => 'required',
            'credit_days' => 'required',
            'discount'=>'nullable',
            'addition'=>'nullable',
            'credit_note'=>'nullable',
        ]);

        $pr = Purchase::findOrFail($id)->update($validate);

        PurchaseItem::where('purchase_id',$id)->delete();

        foreach ($request->purchase_items as $item) {
            PurchaseItem::create([
                'purchase_id'       => $pr->id,
                'product_name' => $item['product_name'],
                'pcs'               => $item['pcs'],
                'gwt'               => $item['gwt'],
                'nwt'               => $item['nwt'],
                'rate'              => $item['rate'],
                'other_chg'         => $item['other_chg'],
                'disc'              => $item['disc'],
                'disc_percent'      => $item['disc_percent'],
                'gst'               => $item['gst'],
                'taxable'           => $item['taxable'],
                'total_gst'         => $item['total_gst'],
                'net_amount'        => $item['net_amount'],
            ]);
        }

        return \response()->json(['message'=>'Purchase update successful']);
    }


    public function deleteAllPurchase()
{

     // Count the total number of records before deletion
     $totalRecords = Purchase::count();

     if ($totalRecords === 0) {
         return response()->json(['message' => 'No records found to delete'], 404);
     }

     // Disable foreign key checks (temporarily)
     \DB::statement('SET FOREIGN_KEY_CHECKS=0;');

     // Delete all records manually instead of truncate
     PurchaseItem::query()->delete();
     Purchase::query()->delete(); // ✅ Correct way to delete all records

     // Enable foreign key checks again
     \DB::statement('SET FOREIGN_KEY_CHECKS=1;');
    return response()->json(['message' => 'All purchase records deleted'], 200);
}



    public function uploadPurchaseCsv(Request $request)
{
    // Validate request
    $validator = Validator::make($request->all(), [
        'file' => 'required|mimes:csv,txt',
        'data' => 'required|string', // Expect JSON string from FormData
        'product_name' => 'required|string',
    ]);

    if ($validator->fails()) {
        return response()->json(['error' => $validator->errors()], 400);
    }

    // Decode JSON string to array
    $purchaseData = json_decode($request->input('data'), true);
    $product_name = json_decode($request->input('product_name'));

    // Validate decoded JSON data
    if (!$purchaseData) {
        return response()->json(['error' => 'Invalid purchase data format'], 400);
    }

    // Create a new Purchase record
    $purchase = Purchase::create([
        'voucher_no'   => $purchaseData['voucher_no'],
        'date'         => $purchaseData['date'],
        'bill_no'      => $purchaseData['bill_no'],
        'is_igst'      => $purchaseData['is_igst'],
        'user_id'      => $purchaseData['user_id'],
        'payment_mode' => $purchaseData['payment_mode'],
        'credit_days'  => $purchaseData['credit_days'],
        //'discount'     => $purchaseData['discount'],
       // 'addition'     => $purchaseData['addition'],
        //'credit_note'  => $purchaseData['credit_note'],
    ]);

    // Store purchase items from JSON
    if (!empty($purchaseData['purchase_items'])) {
        foreach ($purchaseData['purchase_items'] as $item) {
            PurchaseItem::create([
                'purchase_id'  => $purchase->id, // Link to the newly created purchase
                'product_name' => $product_name,
                'gst'          => $item['gst'] ?? 0, // Handle missing fields safely

            ]);
        }
    }

    // Handle CSV file upload
    if ($request->hasFile('file')) {
        $file = $request->file('file');
        $data = array_map('str_getcsv', file($file->getPathname()));

        if (count($data) < 2) {
            return response()->json(['error' => 'Invalid CSV format'], 400);
        }

        array_shift($data); // Remove CSV header row

        foreach ($data as $row) {
            if (count($row) < 8) {
                continue; // Skip invalid rows
            }

            PurchaseItem::create([
                'purchase_id'  => $purchase->id, // Link to the new purchase
                'pcs'          => $row[0] ?? null,
                'gwt'          => $row[1] ?? null,
                'nwt'          => $row[2] ?? null,
                'rate'         => $row[3] ?? null,
                'other_chg'    => $row[4] ?? null,
                'disc'         => $row[5] ?? null,
                'disc_percent' => $row[6] ?? null,
                'total_gst'    => $row[7] ?? null,
                'net_amount'   => $row[7] ?? null,
                'product_name' => $purchaseData['purchase_items'][0]['product_name'] ?? 'Unknown',
                'gst'          => $purchaseData['purchase_items'][0]['gst'] ?? 0,
            ]);
        }
    }

    return response()->json(['message' => 'Purchase data stored successfully', 'purchase_id' => $purchase->id]);
}





    public function downloadSamplePurchase()
{
    $headers = [
        "Content-type" => "text/csv",
        "Content-Disposition" => "attachment; filename=sample_purchase.csv",
        "Pragma" => "no-cache",
        "Expires" => "0"
    ];

    $columns = [ 'pcs', 'gwt','nwt','rate','other_chg','disc','disc_percent','taxable','total_gst','net_amount']; // Adjust columns as per your database table

    $callback = function() use ($columns) {
        $file = fopen('php://output', 'w');
        fputcsv($file, $columns); // Writing headers
        fclose($file);
    };

    return response()->stream($callback, 200, $headers);
}



    public function destroy($id){
        PurchaseItem::where('purchase_id',$id)->delete();
        Purchase::findOrFail($id)->delete();
        return \response()->json(['message'=>'Purchase delete successful']);
    }


    public function bulkUploadCSV(Request $request)
{

    $customer = JWTAuth::parseToken()->authenticate();

    if (!$request->hasFile('file')) {
        return response()->json(['error' => 'No file uploaded'], 400);
    }

    $file = $request->file('file');
    $csvData = file_get_contents($file);
    $rows = array_map('str_getcsv', explode("\n", $csvData));
    $header = array_shift($rows); // Extract the header row

    foreach ($rows as $row) {
        // Skip empty or invalid rows
        if (count($row) < 17) continue;

        // Map headers to row values
        $row = array_combine($header, $row);

        // Check if product exists or create a new one
        $product = ProductService::firstOrCreate(['name' => $row['product_name']]);
        // dd($product);


        // Create the purchase record
        $purchase = Purchase::create([
            'voucher_no'   => $row['voucher_no'],
            'date'         => $row['date'],
            'bill_no'      => $row['bill_no'],
            'payment_mode' => $row['payment_mode'],
            'credit_days'  => $row['credit_days'],
            'user_id'      => 1,
            'created_by'   => $customer->id,
        ]);

        // Create the purchase item
        PurchaseItem::create([
            'purchase_id'  => $purchase->id,
            'product_service_id'   => $product->id,
            'product_name' => $row['product_name'],
            'pcs'          => $row['pcs'],
            'gwt'          => $row['gwt'],
            'nwt'          => $row['nwt'],
            'rate'         => $row['rate'],
            'other_chg'    => $row['other_chg'],
            'disc'         => $row['disc'],
            'disc_percent' => $row['disc_percent'],
            'gst'          => $row['gst'],
            'taxable'      => $row['taxable'],
            'total_gst'    => $row['total_gst'],
            'net_amount'   => $row['net_amount'],
        ]);
    }

    return response()->json(['message' => 'Bulk upload successful']);


}

public function Saloonstore(Request $request)
{
    $customer = JWTAuth::parseToken()->authenticate();

    $validate = $request->validate([
        'voucher_no' => 'required',
        'date' => 'required',
        'bill_no' => 'required',
        'is_igst' => 'nullable',
        'user_id' => 'nullable',
        'payment_mode' => 'required',
        'credit_days' => 'required',
        'discount' => 'nullable',
        'addition' => 'nullable',
        'credit_note' => 'nullable',
    ]);

    $validate['created_by'] = $customer->id;

    // Create Purchase
    $pr = Purchase::create($validate);

    foreach ($request->purchase_items as $item) {
        // Create Purchase Item
        PurchaseItem::create([
            'purchase_id'        => $pr->id,
            'product_name'       => $item['product_name'],
            'product_service_id' => $item['product_service_id'],
            'pcs'                => $item['pcs'],
            'gwt'                => $item['gwt'],
            'nwt'                => $item['nwt'],
            'rate'               => $item['rate'],
            'other_chg'          => $item['other_chg'],
            'disc'               => $item['disc'],
            'disc_percent'       => $item['disc_percent'],
            'gst'                => $item['gst'],
            'taxable'            => $item['taxable'],
            'total_gst'          => $item['total_gst'],
            'net_amount'         => $item['net_amount'],
        ]);

        // Update ProductService current_stock
        $product = ProductService::where('id', $item['product_service_id'])
            ->where('created_by', $customer->id)
            ->first();

        if ($product) {
            $product->current_stock += (int)($item['pcs'] ?? 1); // 'pcs' used as quantity
            $product->save();
        }
    }

    return response()->json(['message' => 'Purchase created successfully']);
}

//fetch function 
public function fetchPurchase(){
    $customer=JWTAuth::parseToken()->authenticate();
    $purchases=Purchase::with(['purchase_items','supplier'])
       ->where('created_by',$customer->id)
       ->orderBy('created_at', 'desc')
       ->get();
       if(!$purchases){
        return response()->json(['message'=>'No purchase Found',404]);
       }

       return response()->json(['data'=>$purchases],200);
}


}
