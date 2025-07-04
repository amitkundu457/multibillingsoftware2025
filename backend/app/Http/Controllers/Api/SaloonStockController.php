<?php


namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ProductService;
use App\Models\StockTransaction;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Carbon;



class SaloonStockController extends Controller
{
    //

    
    // Add stock to product
    public function addStock(Request $request)
    {
        $customer = JWTAuth::parseToken()->authenticate();

        // dd($request->all());
        // $request->validate([
        //     'product_service_id' => 'required|exists:products,id',
        //     'quantity' => 'required|integer|min:1',
        //     'source' => 'nullable|string',
        //     'remarks' => 'nullable|string',
        // ]);
// dd($request->all());
        // $product = ProductService::findOrFail(37);
        // $product = ProductService::findOrFail($request->product_service_id);

        $product=ProductService::where('id',$request->product_service_id)
                                    ->where('created_by',$customer->id)->first();

       
                                    if (!$product) {
            return response()->json(['message'=>'product not found'],404);
        }
        $product->current_stock += $request->quantity;
        $product->save();

      $stockcreated=StockTransaction::create([
            'product_service_id' => $product->id,
            'quantity' => $request->quantity,
            'type' => 'in',
            'source' => $request->source ?? 'manual',
            'remarks' => $request->remarks ?? null,
            'created_by'=>$customer->id,
        ]);

        return response()->json(['message' => 'Stock added successfully','data'=>$stockcreated]);
    }

    //fetch the stock added to product

    public function getStockList(){
        $customer=JWTAuth::parseToken()->authenticate();
        $stocks=StockTransaction::where('created_by',$customer->id)
        ->where('type','in')
                ->with('product')
                ->orderBy('created_at','desc')
                ->where('type','in')->get();
                if ($stocks->isEmpty()) {
                    return response()->json(['message' => 'No Stock Found'], 404);
                }

                return response()->json(['data'=>$stocks],200);
    }

    //bulk uplod
    public function bulkAddStock(Request $request)
{
    $customer = JWTAuth::parseToken()->authenticate();

    // Validate that a file is uploaded
    $request->validate([
        'file' => 'required|file|mimes:csv,txt'
    ]);

    $file = $request->file('file');
    $handle = fopen($file, 'r');
    $header = fgetcsv($handle); // skip header

    $success = [];
    $errors = [];

    while (($row = fgetcsv($handle)) !== false) {
        // Map the row to expected fields
        $data = array_combine($header, $row);

        // Validation per row
        $validator = Validator::make($data, [
            'product_service_id' => 'required|integer|exists:product_services,id',
            'quantity' => 'required|integer|min:1',
            'source' => 'nullable|string',
            'remarks' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            $errors[] = [
                'row' => $data,
                'error' => $validator->errors()->all()
            ];
            continue;
        }

        // Check if product belongs to user
        $product = ProductService::where('id', $data['product_service_id'])
            ->where('created_by', $customer->id)
            ->first();

        if (!$product) {
            $errors[] = [
                'row' => $data,
                'error' => ['Product not found or unauthorized']
            ];
            continue;
        }

        // Update stock
        $product->current_stock += $data['quantity'];
        $product->save();

        // Create transaction
        $transaction = StockTransaction::create([
            'product_service_id' => $product->id,
            'quantity' => $data['quantity'],
            'type' => 'in',
            'source' => $data['source'] ?? 'manual',
            'remarks' => $data['remarks'] ?? null,
            'created_by' => $customer->id,
        ]);

        $success[] = $transaction;
    }

    fclose($handle);

    return response()->json([
        'message' => 'Bulk stock upload complete.',
        'success_count' => count($success),
        'error_count' => count($errors),
        'errors' => $errors,
    ]);
}



//update the stock of product
public function updateStock(Request $request, $id)
{
    $customer = JWTAuth::parseToken()->authenticate();

    $request->validate([
        'quantity' => 'required|integer|min:1',
        'source' => 'nullable|string',
        'remarks' => 'nullable|string',
    ]);

    // Find stock transaction
    $stock = StockTransaction::where('id', $id)
                ->where('created_by', $customer->id)
                ->first();

    if (!$stock) {
        return response()->json(['message' => 'Stock record not found'], 404);
    }

    // Find the related product
    $product = ProductService::where('id', $stock->product_service_id)
                ->where('created_by', $customer->id)
                ->first();

    if (!$product) {
        return response()->json(['message' => 'Product not found'], 404);
    }

    // Adjust current stock: subtract old quantity, add new
    $product->current_stock = $product->current_stock - $stock->quantity + $request->quantity;
    $product->save();

    // Update stock transaction
    $stock->quantity = $request->quantity;
    $stock->source = $request->source ?? $stock->source;
    $stock->remarks = $request->remarks ?? $stock->remarks;
    $stock->save();

    return response()->json(['message' => 'Stock updated successfully', 'data' => $stock]);
}



//delete the project
public function deleteStock($id)
{
    $customer = JWTAuth::parseToken()->authenticate();

    // Find the stock transaction
    $stock = StockTransaction::where('id', $id)
                ->where('created_by', $customer->id)
                ->first();

    if (!$stock) {
        return response()->json(['message' => 'Stock record not found'], 404);
    }

    // Find the associated product
    $product = ProductService::where('id', $stock->product_service_id)
                ->where('created_by', $customer->id)
                ->first();

    if ($product) {
        // Subtract the stock quantity from product current_stock
        $product->current_stock -= $stock->quantity;
        $product->save();
    }

    // Delete the stock transaction
    $stock->delete();

    return response()->json(['message' => 'Stock deleted successfully']);
}



    // Remove stock from product
    public function removeStock(Request $request)
    {
        // $request->validate([
        //     'product_service_id' => 'required|exists:products,id',
        //     'quantity' => 'required|integer|min:1',
        //     'source' => 'nullable|string',
        //     'remarks' => 'nullable|string',
        // ]);

        $product = ProductService::findOrFail($request->product_service_id);

        if ($product->current_stock < $request->quantity) {
            return response()->json(['error' => 'Insufficient stock'], 400);
        }

        $product->current_stock -= $request->quantity;
        $product->save();

        StockTransaction::create([
            'product_service_id' => $product->id,
            'quantity' => $request->quantity,
            'type' => 'out',
            'source' => $request->source ?? 'manual',
            'remarks' => $request->remarks
        ]);

        return response()->json(['message' => 'Stock removed successfully']);
    }
}


