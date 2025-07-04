<?php

namespace App\Http\Controllers\Api;

use App\Models\Barcode;
use Illuminate\Http\Request;
use App\Exports\BarcodeExport;
use Barryvdh\DomPDF\Facade\Pdf;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\Validator;
use App\Models\BarcodePrintHistory;
use App\Models\BarcodePrintHistory as ModelsBarcodePrintHistory;

class BarcodeController extends Controller
{
    public function index() {
        $admin = JWTAuth::parseToken()->authenticate();

        return Barcode::join('product_services', 'product_services.id', '=', 'barcodes.item_id')
            ->select(
                'barcodes.id', 'barcodes.barcode_no', 'barcodes.sku', 'barcodes.itemno',
                'barcodes.item_id', 'barcodes.brand_id', 'barcodes.purity_id', 'barcodes.huid','barcodes.making_in_rs','barcodes.making_in_percent','barcodes.hallmark','barcodes.hallmark_charge','barcodes.wastage_charge','barcodes.other_charge','barcodes.making_in_rs','barcodes.diamond_value','barcodes.diamond_details','barcodes.stone_value','barcodes.stone_details',
                'barcodes.gwt', 'barcodes.nwt', 'barcodes.design', 'barcodes.pcs', 'barcodes.supplier_id',
                'barcodes.bill_number', 'barcodes.image', 'barcodes.basic_rate', 'barcodes.purchase_rates',
                'barcodes.mrp', 'barcodes.sale_rate', 'barcodes.gm', 'barcodes.diamond_value',
                'barcodes.diamond_details', 'barcodes.stone_details', 'barcodes.stone_value',
                'product_services.name as product_name'
            )
            ->where('barcodes.created_by', $admin->id)
            ->get();
    }

    public function store(Request $request)
{
    Log::info('Incoming Request Data:', $request->all());

    $admin = JWTAuth::parseToken()->authenticate();

    $request->validate([
        'barcode_no' => 'required|string', // Prefix
        'sku' => 'nullable|string',
        'item_id' => 'nullable|integer',
        'brand_id' => 'nullable|integer',
    ]);

    $prefix = $request->barcode_no ?? ''; // Default to empty if not provided

    // Fetch the last stored barcode
    $lastBarcode = Barcode::latest('id')->first();

    if ($lastBarcode) {
        // Extract only the last 4 digits
        preg_match('/(\d{4})$/', $lastBarcode->barcode_no, $matches);
        $lastNumber = isset($matches[1]) ? (int) $matches[1] : 1000;
        $newSuffix = $lastNumber + 1;
    } else {
        $newSuffix = 1001; // Start from 1001
    }

    // Ensure suffix is exactly 4 digits
    $formattedSuffix = substr("0000" . $newSuffix, -4);

    // Concatenate prefix with the new 4-digit suffix
    $finalBarcode = $prefix . $formattedSuffix;

    // Store data
    $data = $request->except('barcode_no'); // Avoid request override
    $data['barcode_no'] = $finalBarcode;
    $data['created_by'] = $admin->id;

    Barcode::create($data);

    return response()->json([
        'status' => 'success',
        'message' => 'Data stored successfully',
        'barcode_no' => $finalBarcode
    ]);
}


//barocde count by user

public function countByAuthenticatedUser()
{
    try {
        $customer = JWTAuth::parseToken()->authenticate();
        Log::info('Authenticated Customer:', ['customer' => $customer]);

        $count = Barcode::where('created_by', $customer->id)->count();

        return response()->json([
            'status' => 'success',
            'message' => 'Barcode count retrieved successfully',
            'user_id' => $customer->id,
            'barcode_count' => $count,
        ]);
    } catch (\Exception $e) {
        Log::error('Failed to count barcodes:', ['error' => $e->getMessage()]);
        return response()->json([
            'status' => 'error',
            'message' => 'Unauthorized or invalid token',
        ], 401);
    }
}


    public function getNextBarcode()
    {
        // Get the last barcode and extract the numeric suffix
        $lastBarcode = Barcode::latest()->first();

        if ($lastBarcode) {
            // Extract the numeric suffix from the last barcode
            preg_match('/(\d+)$/', $lastBarcode->barcode_no, $matches);
            $nextNumber = isset($matches[1]) ? intval($matches[1]) + 1 : 1001;
        } else {
            $nextNumber = 1001; // Default starting number
        }

        return response()->json([
            'next_barcode_number' => $nextNumber
        ]);
    }






    public function uploadBarcodeCsv(Request $request){
        $admin = JWTAuth::parseToken()->authenticate();
        $data = $request->all();
        $data['created_by'] = $admin->id;
        $itemId = $request->input('item_id');
        $brandId = $request->input('brand_id');
        $purityId = $request->input('purity_id');
        $barcodeno = $request->input('barcode_no');




        $validator = Validator::make($request->all(), [
            'file' => 'required|mimes:csv,txt',
            'item_id' => 'required|integer', // Ensure item_id is provided
            'brand_id' => 'required|integer',
            'purity_id' => 'required|integer',
            'barcode_no' => 'required|string',

        ]);


        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 400);
        }

        $file = $request->file('file');
        $data = array_map('str_getcsv', file($file));


        if (count($data) < 2) {
            return response()->json(['error' => 'Invalid CSV format'], 400);
        }


        array_shift($data); // Remove CSV header row


        foreach ($data as $row) {
            Barcode::create([
                 'sku' => $row[0],
                'itemno' => $row[1],
                'huid' => $row[2],
                'gwt' => $row[3],
                'nwt' => $row[4],
                'design' => $row[5],
                'pcs' => $row[6],
                'bill_number' => $row[7],
                'basic_rate' => $row[8],
                'purchase_rates'=> $row[9],

                'mrp' => $row[10],
                'sale_rate' => $row[11],
                'gm' => $row[12],
                'diamond_value' => $row[13],
                'diamond_details'=>$row[14],
                'stone_details' => $row[15],
                'stone_value' => $row[16],
                'item_id' => $itemId, // Save item_id in each row
                'brand_id' => $brandId,
                'purity_id' => $purityId,
                'created_by' =>  $admin->id,
                'barcode_no' => $barcodeno


            ]);
        }

        return response()->json(['message' => 'barcode data uploaded successfully']);



    }



    public function downloadSampleBarcode()
    {
        $headers = [
            "Content-type" => "text/csv",
            "Content-Disposition" => "attachment; filename=sample_barcode.csv",
            "Pragma" => "no-cache",
            "Expires" => "0"
        ];

        $columns = [
        'sku',
        'itemno',
        'huid',
        'gwt',
        'nwt',
        'design',
        'pcs',
        'bill_number',
        'basic_rate',
        'purchase_rates',
        'mrp',
        'sale_rate',
        'gm',
        'diamond_value',
        'diamond_details',
        'stone_details',
        'stone_value',]; // Adjust columns as per your database table

        $callback = function() use ($columns) {
            $file = fopen('php://output', 'w');
            fputcsv($file, $columns); // Writing headers
            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }







    public function update(Request $request, Barcode $barcode)
    {
        // $request->validate([
        //     'barcode_no' => 'required|string',
        //     // 'sku' => 'required|string',
        //     'item_id' => 'required|integer',
        //     'brand_id' => 'required|integer',
        // ]);

        $barcode->update($request->all());
        return response()->json([
            'status' => 'success',
            'message' => 'Data updated successfully'
        ]);
    }

    public function destroy($id)
    {
        $barcode = Barcode::find($id);

        if (!$barcode) {
            return response()->json([
                'message' => 'Barcode not found.'
            ], 404);
        }

        $barcode->delete();
        return response()->json([
            'message' => 'Barcode deleted successfully.'
        ]);
    }

    public function show() {
        $barcodes = Barcode::all();

        if ($barcodes->isEmpty()) {
            return response()->json([
                'status' => 'error',
                'message' => 'No barcodes found.'
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $barcodes
        ]);
    }

    public function report(Request $request)
    {
        try {
            $format = $request->query('format', 'pdf'); // Default format: PDF
            $startDate = $request->query('start_date');
            $endDate = $request->query('end_date');

            $query = Barcode::select('id', 'barcode_no', 'sku', 'itemno', 'design', 'sale_rate', 'created_at');

            if ($startDate) {
                $query->whereDate('created_at', '>=', $startDate);
            }
            if ($endDate) {
                $query->whereDate('created_at', '<=', $endDate);
            }

            $barcodes = $query->get();

            if ($barcodes->isEmpty()) {
                return response()->json(['error' => 'No barcodes found'], 404);
            }

            if ($format === 'pdf') {
                $html = $this->generateBarcodePDFHTML($barcodes);
                $pdf = Pdf::loadHTML($html);
                return response($pdf->output(), 200, [
                    'Content-Type' => 'application/pdf',
                    'Content-Disposition' => 'attachment; filename="BarcodeReport.pdf"',
                ]);
            } elseif ($format === 'xlsx') {
                return Excel::download(new BarcodeExport($barcodes), 'BarcodeReport.xlsx');
            } else {
                return response()->json(['error' => 'Invalid format'], 400);
            }
        } catch (\Exception $e) {
            Log::error('Barcode report generation failed: ' . $e->getMessage());
            return response()->json(['error' => 'Report generation failed'], 500);
        }
    }

    private function generateBarcodePDFHTML($barcodes)
    {
        $html = '
        <html>
        <head>
            <title>Barcode Report</title>
            <style>
                body { font-family: Arial, sans-serif; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { border: 1px solid black; padding: 8px; text-align: left; }
                th { background-color: #f2f2f2; }
            </style>
        </head>
        <body>
            <h2>Barcode Report</h2>
            <table>
                <tr>
                    <th>ID</th>
                    <th>Barcode No</th>
                    <th>SKU</th>
                    <th>Item No</th>
                    <th>Design</th>
                    <th>Sale Rate</th>
                    <th>Date</th>
                </tr>';

        foreach ($barcodes as $barcode) {
            $html .= "
                <tr>
                    <td>{$barcode->id}</td>
                    <td>{$barcode->barcode_no}</td>
                    <td>{$barcode->sku}</td>
                    <td>{$barcode->itemno}</td>
                    <td>{$barcode->design}</td>
                    <td>{$barcode->sale_rate}</td>
                    <td>{$barcode->created_at}</td>
                </tr>";
        }

        $html .= '
            </table>
        </body>
        </html>';

        return $html;
    }


    public function storePrintHistory(Request $request)
{

    $admin = JWTAuth::parseToken()->authenticate();
    foreach ($request->barcodes as $barcode) {
        BarcodePrintHistory::create([
            'barcode_id' => $barcode['barcode_id'],
            'product_id' => $barcode['product_id'],
            'printed_by' => $admin->id,
            'printed_at' => now(),
        ]);
    }

    return response()->json(['message' => 'Print history recorded'], 200);
}


    public function getPrintHistory()
    {
        $admin = JWTAuth::parseToken()->authenticate();

        $printHistory = BarcodePrintHistory::with(['product', 'barcode', 'user'])
            ->where('printed_by', $admin->id)
            ->get();

        return response()->json($printHistory);
    }

}
