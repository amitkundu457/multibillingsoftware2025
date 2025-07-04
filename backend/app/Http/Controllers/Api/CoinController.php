<?php

namespace App\Http\Controllers\Api;

use App\Models\Coin;
use App\Models\OrderCoinSetting;

use App\Models\AssignClient;
use App\Models\ConiPurchase;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use App\Http\Controllers\Controller;
use App\Models\Distrubutrer;
use App\Models\SoftwareCommission;
use Illuminate\Support\Facades\Auth;
use Illuminate\Container\Attributes\Log;

class CoinController extends Controller
{
    public function index()
    {
        $groups = Coin::all();
        return response()->json($groups);
    }

    // Store a new product service group (returns JSON)
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $group = Coin::create($request->all());

        return response()->json(['message' => 'Product Service Group created successfully.', 'data' => $group]);
    }

    // Show the form to edit a product service group (returns JSON)
    public function show(Request $request)
    {
        // Authenticate the user
        $user = JWTAuth::parseToken()->authenticate();

        $user = JWTAuth::parseToken()->authenticate();
        // \Log::info($user);


        // // Get the authenticated user

        // if (!$user) {
        //     return response()->json(['error' => 'User not authenticated'], 401);
        // }

        // Sum up all the coins the user has purchased
        $totalCoins = ConiPurchase::where('created_by',$user->id)->sum('coins'); // Assuming a 'purchases' relationship

        $lastRecharge = ConiPurchase::where('created_by', $user->id)
        ->latest('created_at')
        ->first();

        return response()->json([
            'message' => 'Total coins calculated successfully!',
          //  'user' => $user,
            'total_coins' => $totalCoins,
            'last_recharge_date' => $lastRecharge ? $lastRecharge->created_at->format('d/m/Y') : null,

        ]);
    }


    // Update a product service group (returns JSON)
    public function update(Request $request, Coin $coin)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $coin->update($request->all());

        return response()->json(['message' => 'Product Service Group updated successfully.', 'data' => $coin]);
    }

    // Delete a product service group (returns JSON)
    public function destroy(Coin $coin)
    {
        $coin->delete();

        return response()->json(['message' => 'Product Service Group deleted successfully.']);
    }


    public function coinpurchase(Request $request)
    {
        $customer = JWTAuth::parseToken()->authenticate();

        // Log::info($customer);
        $validated = $request->validate([
            'coins' => 'required|integer',
            'amount' => 'required|numeric',
            'payment_method' => 'required|string|in:cash,online',
        ]);

        $recharge = ConiPurchase::create([
            'coins' => $validated['coins'],
            'amount' => $validated['amount'],
            'payment_method' => $validated['payment_method'],
            'created_by' => $customer->id,
        ]);

        $dstb = AssignClient::where('client_id', $customer->id)->first()->distributor_id;
        $commission_rate = \intval(Distrubutrer::where('user_id', $dstb)->first()->commission);
        $commission = $validated['amount'] * ($commission_rate / 100);
        SoftwareCommission::create([
            'user_id' => $dstb,
            'user_information_id' => $customer->id,
            'commission' => $commission,
            'total_amount' => $validated['amount'],
            // 'software_type'=>  $request->software_type, //specify software type e.g. jwellery, resturant, saloon, crm
        ]);



        return response()->json([
            'message' => 'Recharge successful!',
            'data' => $recharge,
        ]);
    }



    public function setCoinsPerOrder(Request $request)
    {
        $request->validate([
            'coins_per_order' => 'required|integer|min:0',
        ]);

        // You can choose to allow only one row or version it (latest used)
        OrderCoinSetting::truncate(); // optional: ensures only one value is stored
        OrderCoinSetting::create([
            'coins_per_order' => $request->coins_per_order
        ]);

        return response()->json([
            'message' => 'Coins per order set successfully.'
        ]);
    }

 public function getCoinsPerOrder()
{
    $setting = OrderCoinSetting::latest()->first();

    return response()->json([
        'coins_per_order' => $setting ? (int) $setting->coins_per_order : null,
        'message' => $setting ? 'Coins per order fetched successfully.' : 'No setting found.'
    ]);
}

}
