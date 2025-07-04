<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Master;  // Import the Master model
use Illuminate\Http\Request;
use App\Models\RateMasters;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Log;



class RateMasterController extends Controller
{

    // public function index()
    // {
    //     $customer = JWTAuth::parseToken()->authenticate();
    // Log::info('Authenticated Customer:', ['customer' => $customer]);


    //     // Fetch all RateMaster records from the database
    //     $rateMasters = RateMasters::all();

    //     // Debug: Check if the data is fetched correctly
    //     if ($rateMasters->isEmpty()) {
    //         return response()->json(['message' => 'No data found.'], 404);
    //     }

    //     // Return the records as a JSON response
    //     return response()->json($rateMasters, 200);
    // }
    public function index()
    {
        $customer = JWTAuth::parseToken()->authenticate();
        Log::info('Authenticated Customer:', ['customer' => $customer]);
    
        // Fetch only RateMasters created by the authenticated customer
        $rateMasters = RateMasters::where('created_by', $customer->id)->get();
    
        if ($rateMasters->isEmpty()) {
            return response()->json(['message' => 'No data found.'], 404);
        }
    
        return response()->json($rateMasters, 200);
    }
    

    // Store method for creating a new master record
    // public function store(Request $request)
    // {
    //     // Validate the incoming request data
    //     $request->validate([
    //         'labelhere' => 'required|string|max:255',
    //         'rate' => 'required|numeric',
    //         'purity' => 'nullable|numeric',
    //        'makingpergm' => 'nullable|numeric',
    //        // 'makingprpercent' => 'required|numeric',
    //         'makingdiscpercent' => 'nullable|numeric',
    //         //'makingdiscprice' => 'required|numeric',
    //     ]);

    //     // Create a new master record
    //     $master = RateMasters::create([ // Ensure you're using the correct model
    //         'labelhere' => $request->input('labelhere'),
    //         'rate' => $request->input('rate'),
    //         'purity' => $request->input('purity'),
    //         'makingpergm' => $request->input('makingpergm'),
    //        // 'makingprpercent' => $request->input('makingprpercent'),
    //         'makingdiscpercent' => $request->input('makingdiscpercent'),
    //        // 'makingdiscprice' => $request->input('makingdiscprice'),
    //     ]);

    //     // Return a success response
    //     return response()->json([
    //         'message' => 'Master record created successfully!',
    //         'data' => $master,
    //     ], 201);
    // }

    public function store(Request $request)
{
    // Authenticate the user
    $customer = JWTAuth::parseToken()->authenticate();

    // Validate the incoming request data
    $request->validate([
        'labelhere' => 'required|string|max:255',
        'rate' => 'required|numeric',
        'purity' => 'nullable|numeric',
        'makingpergm' => 'nullable|numeric',
        'makingdiscpercent' => 'nullable|numeric',
    ]);

    // Create a new RateMasters record with created_by
    $master = RateMasters::create([
        'labelhere' => $request->input('labelhere'),
        'rate' => $request->input('rate'),
        'purity' => $request->input('purity'),
        'makingpergm' => $request->input('makingpergm'),
        'makingdiscpercent' => $request->input('makingdiscpercent'),
        'created_by' => $customer->id, // Add the authenticated customer's ID
    ]);

    return response()->json([
        'message' => 'Master record created successfully!',
        'data' => $master,
    ], 201);
}

    public function update(Request $request, $id)
    {
        // Find the record by its ID
        $rateMaster = RateMasters::find($id);

        if (!$rateMaster) {
            return response()->json([
                'message' => 'Record not found',
            ], 404);
        }

        // Validate the incoming data
        $request->validate([
            'labelhere' => 'required|string|max:255',
            'rate' => 'required|numeric',
            'purity' => 'nullable|numeric',
            'makingpergm' => 'nullable|numeric',
           // 'makingprpercent' => 'required|numeric',
            'makingdiscpercent' => 'nullable|numeric',
           // 'makingdiscprice' => 'required|numeric',
        ]);

        // Update the record
        $rateMaster->labelhere = $request->input('labelhere');
        $rateMaster->rate = $request->input('rate');
        $rateMaster->purity = $request->input('purity');
        $rateMaster->makingpergm = $request->input('makingpergm');
       // $rateMaster->makingprpercent = $request->input('makingprpercent');
        $rateMaster->makingdiscpercent = $request->input('makingdiscpercent');
       // $rateMaster->makingdiscprice = $request->input('makingdiscprice');

        // Save the changes
        $rateMaster->save();

        // Return a success response
        return response()->json([
            'message' => 'RateMaster record updated successfully!',
            'data' => $rateMaster,
        ], 200);
    }

    public function destroy($id)
{
    // Find the RateMaster entry by its ID
    $rateMaster = RateMasters::find($id);



    if (!$rateMaster) {
        return response()->json(['message' => 'RateMaster not found.'], 404);
    }

    $rateMaster->delete();

    return response()->json(['message' => 'RateMaster deleted successfully.'], 200);
}


}
