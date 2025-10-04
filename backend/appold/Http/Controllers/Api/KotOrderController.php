<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\KotOrder;
use App\Models\KotOrderItem;
use App\Models\ProductService;
use App\Models\Kot;
use Tymon\JWTAuth\Facades\JWTAuth;

class KotOrderController extends Controller
{
     public function store(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();

        $request->validate([
             'table_no' => 'required|array|min:1',
             'table_no.*' => 'required|string',
            // 'table_no' => 'required|string',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|integer',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.product_price' => 'required|numeric|min:0',
        ]);

        // $kotOrder = KotOrder::create([
        //     'table_no' => $request->table_no,
        // ]);


        // foreach ($request->items as $item) {
        //     KotOrderItem::create([
        //         'kot_order_id' => $kotOrder->id,
        //         'product_id' => $item['product_id'],
        //          'quantity' => $item['quantity'],
        //         'product_price' => $item['product_price'],
        //     ]);
        // }

        foreach ($request->table_no as $tableNo) {
    $kotOrder = KotOrder::create([
        'table_no' => $tableNo,
    ]);

    foreach ($request->items as $item) {
        KotOrderItem::create([
            'kot_order_id' => $kotOrder->id,
            'product_id' => $item['product_id'],
            'quantity' => $item['quantity'],
            'product_price' => $item['product_price'],
        ]);
    }
}


        return response()->json([
            'message' => 'Order placed and KOT generated successfully.',
            'kot_order_id' => $kotOrder->id,
            'table_no' => $kotOrder->table_no,
        ]);
    }





    // Show combined bill for a table
    public function showBill($tableNo)
    {
        $kotOrders = KotOrder::with(['items.product'])
            ->where('table_no', $tableNo)
            ->get();

        $items = [];

        foreach ($kotOrders as $kot) {
            foreach ($kot->items as $item) {
                $items[] = [
                    'product_id' => $item->product_id,
                    'product_name' => $item->product ? $item->product->name : null,
                    'quantity' => $item->quantity,
                    'product_price' => $item->product_price,
                    'total' => $item->quantity * $item->product_price,
                ];
            }
        }

        $total = collect($items)->sum('total');
        $gst = round($total * 0.18, 2);
        $grandTotal = $total + $gst;

        return response()->json([
            'table_no' => $tableNo,
            'items' => $items,
            'subtotal' => $total,
            'gst' => $gst,
            'grand_total' => $grandTotal,
        ]);
    }


    public function getBillByTableNumber(Request $request)
    {
        $request->validate([
            'table_no' => 'required|string'
        ]);

        $tableNo = $request->table_no;

        $kotOrders = KotOrder::with(['items.product'])
            ->where('table_no', $tableNo)
            ->get();

        $items = [];

        foreach ($kotOrders as $kot) {
            foreach ($kot->items as $item) {
                $items[] = [
                    'product_id' => $item->product_id,
                    'product_name' => optional($item->product)->name,
                    'quantity' => $item->quantity,
                    'product_price' => $item->product_price,
                    'total' => $item->quantity * $item->product_price,
                ];
            }
        }

        $subtotal = collect($items)->sum('total');
        $gst = round($subtotal * 0.18, 2);
        $grandTotal = $subtotal + $gst;

        return response()->json([
            'table_no' => $tableNo,
            'items' => $items,
            'subtotal' => $subtotal,
            'gst' => $gst,
            'grand_total' => $grandTotal,
        ]);
    }
}
