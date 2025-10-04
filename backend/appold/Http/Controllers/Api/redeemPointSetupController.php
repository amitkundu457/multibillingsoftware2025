<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\RedeemSetup;


class redeemPointSetupController extends Controller
{
    //

    public function index(){
        $redeems = RedeemSetup::with('loyalty')->get(); // Include loyalty table data
        return response()->json($redeems);
    }



    public function store(Request $request){
        $request->validate([
            'redeem_points' => 'required|integer',
            'redeem_point_value_ofEach_point' => 'required|integer',
            'max_redeem' => 'required|integer',
            'min_invcValue_needed_toStartRedemp' => 'required|integer',
            'loyalty_id' => 'required|exists:loyalties,id',
        ]);

        $redeem = RedeemSetup::create($request->all());
        return response()->json(['message' => 'Redeem setup saved successfully', 'data' => $redeem], 201);




    }

    public function update(Request $request, $id){

        $redeem = RedeemSetup::find($id);

        if (!$redeem) {
            return response()->json(['message' => 'Redeem setup not found'], 404);
        }

        $request->validate([
            'redeem_points' => 'required|integer',
            'redeem_point_value_ofEach_point' => 'required|integer',
            'max_redeem' => 'required|integer',
            'min_invcValue_needed_toStartRedemp' => 'required|integer',
            'loyalty_id' => 'required|exists:loyalties,id',
        ]);

        $redeem->update($request->all());

        return response()->json(['message' => 'Redeem setup updated successfully', 'data' => $redeem]);

    }
    public function destroy($id){
        $redeem = RedeemSetup::find($id);

        if (!$redeem) {
            return response()->json(['message' => 'Redeem setup not found'], 404);
        }

        $redeem->delete();

        return response()->json(['message' => 'Redeem setup deleted successfully']);

    }
}
