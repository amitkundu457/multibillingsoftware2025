<?php

namespace App\Http\Controllers\Api;

use App\Models\Karigari;
use App\Models\KarigariItem;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Log;

class KarigariController extends Controller
{
    // public function index()
    // {
    //     $kgi = Karigari::with('karigari_items')->get();
    //     return \response()->json(['karigaries' => $kgi]);
    // }

    //filter the for issuse and recive

    public function index(Request $request)
    {
        $customer = JWTAuth::parseToken()->authenticate();
        Log::info('Authenticated Customer:', ['customer' => $customer]);
    
        // Get the 'type' parameter from the request (optional)
        $type = $request->query('type');
    
        // Query with relationships and filter by created_by
        $query = Karigari::with('karigari_items')
            ->where('created_by', $customer->id); // ✅ Filter by user
    
        // Apply 'type' filter if provided
        if (!empty($type)) {
            $query->where('type', $type);
        }
    
        // Execute query
        $kgi = $query->get();
    
        return response()->json(['karigaries' => $kgi]);
    }
    


    public function show($id)
    {
        $kgi = Karigari::with('karigari_items')->findOrFail($id);
        return \response()->json(['karigari' => $kgi]);
    }

    // public function store(Request $request)
    // {
    //     $kgi = Karigari::create([
    //         'voucher_no' => $request->voucher_no,
    //         'date' => $request->date,
    //         // 'user_id' => $request->user_id,
    //         'type' => $request->type,


    //     ]);


    //     foreach ($request->karigari_items as $item) {

    //         KarigariItem::create([
    //             'karigari_id' => $kgi->id,
    //             'product_name' => $item['product_name'],
    //             'nwt' => $item['nwt'],
    //             'pcs' => $item['pcs'] ?? 0,
    //             'tounch' => $item['tounch'],
    //             'rate' => $item['rate'],
    //             'karigarlist_id' => $item['karigarlist_id'] ?? null,
    //         ]);
    //     }

    //     return \response()->json(['message' => 'Karigari created successfully']);
    // }

    public function store(Request $request)
{
    $customer = JWTAuth::parseToken()->authenticate();
    Log::info('Authenticated Customer:', ['customer' => $customer]);

    $kgi = Karigari::create([
        'voucher_no' => $request->voucher_no,
        'date' => $request->date,
        'type' => $request->type,
        'created_by' => $customer->id, // ✅ Add this
    ]);

    foreach ($request->karigari_items as $item) {
        KarigariItem::create([
            'karigari_id' => $kgi->id,
            'product_name' => $item['product_name'],
            'nwt' => $item['nwt'],
            'pcs' => $item['pcs'] ?? 0,
            'tounch' => $item['tounch'],
            'rate' => $item['rate'],
            'karigarlist_id' => $item['karigarlist_id'] ?? null,
        ]);
    }

    return response()->json(['message' => 'Karigari created successfully']);
}




    public function destroy($id)
{
    $karigari = Karigari::findOrFail($id);
    $karigari->karigari_items()->delete(); // Delete related items first
    $karigari->delete(); // Delete the main record

    return response()->json(['message' => 'Karigari deleted successfully']);
}
public function update(Request $request, $id)
{
    $kgi = Karigari::findOrFail($id);

    $kgi->update([
        'voucher_no' => $request->voucher_no,
        'date' => $request->date,
        'type' => $request->type,
    ]);

    // Delete existing items (optional)
    $kgi->karigari_items()->delete();

    // Ensure `karigari_items` is an array before looping
    $karigariItems = $request->karigari_items ?? [];

    foreach ($karigariItems as $item) {
        KarigariItem::create([
            'karigari_id' => $kgi->id,
            'product_name' => $item['product_name'],
            'nwt' => $item['nwt'],
            'pcs' => $item['pcs'] ?? 0,
            'tounch' => $item['tounch'],
            'rate' => $item['rate'],
            'karigarlist_id' => $item['karigarlist_id'] ?? null,
        ]);
    }

   // return response()->json(['message' => 'Karigari updated successfully']);
    return response()->json([
        'message' => 'Karigari updated successfully',
        'data' => $kgi // Return updated data
    ]);
}



}
