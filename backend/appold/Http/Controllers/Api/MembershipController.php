<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MembershipPlan;
use App\Models\MembershipServiceGroup;
use App\Models\MemberShipServiceRate;
use App\Models\MembershipType;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Validator;

class MembershipController extends Controller
{
    public function index()
    {
        $customer = JWTAuth::parseToken()->authenticate();
        $plans=MembershipPlan::where('created_by',$customer->id)->get();


        // $plans = MembershipPlan::all();
        return response()->json($plans);
    }

    public function store(Request $request)
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
        } catch (\Exception $e) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:50|unique:membership_plans,code',
            'fees' => 'required|numeric|min:0',
            'validity' => 'required|integer|min:1',
            'discount' => 'required|numeric|min:0|max:100',
            'remark' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        $membershipPlan = MembershipPlan::create([
            'name' => $request->name,
            'code' => $request->code,
            'fees' => $request->fees,
            'validity' => $request->validity,
            'discount' => $request->discount,
            'remark' => $request->remark,
            'type_id' =>1,
            'created_by' => $user->id,
        ]);

        return response()->json([
            'message' => 'Membership plan created successfully',
            'data' => $membershipPlan
        ], 201);
    }

    public function show($id)
    {
        $plan = MembershipPlan::find($id);
        if (!$plan) {
            return response()->json(['error' => 'Membership plan not found'], 404);
        }
        return response()->json($plan);
    }

    public function update(Request $request, $id)
    {
        $plan = MembershipPlan::find($id);
        if (!$plan) {
            return response()->json(['error' => 'Membership plan not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:50|unique:membership_plans,code,' . $id,
            'fees' => 'required|numeric|min:0',
            'validity' => 'required|integer|min:1',
            'discount' => 'required|numeric|min:0|max:100',
            'remark' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        $plan->update($request->all());

        return response()->json(['message' => 'Membership plan updated successfully']);
    }

    public function destroy($id)
    {
        $plan = MembershipPlan::find($id);
        if (!$plan) {
            return response()->json(['error' => 'Membership plan not found'], 404);
        }

        $plan->delete();
        return response()->json(['message' => 'Membership plan deleted successfully']);
    }

    public function memberShipServiceGroup()
    {
        return response()->json(MembershipServiceGroup::all());
    }

    public function addServiceToGroup(Request $request)
    {
        $user = JWTAuth::parseToken()->authenticate();
        $validator = Validator::make($request->all(), [
            // 'created_by' => 'required|exists:users,id',
            'name' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        $serviceGroup = MembershipServiceGroup::create([
            'created_by' =>$user->id,
            'name' => $request->name,
            'type_id' =>1,
        ]);

        return response()->json([
            'message' => 'Service added to group successfully',
            'data' => $serviceGroup
        ], 201);
    }

    public function updateServiceGroup(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required|exists:membership_service_groups,id',
            'name' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        MembershipServiceGroup::where('id', $request->id)->update([
            'name' => $request->name,
        ]);

        return response()->json(['message' => 'Service group updated successfully']);
    }

    public function deleteServiceGroup($id)
    {
        $serviceGroup = MembershipServiceGroup::find($id);
        if (!$serviceGroup) {
            return response()->json(['error' => 'Service group not found'], 404);
        }

        $serviceGroup->delete();
        return response()->json(['message' => 'Service group deleted successfully']);
    }




public function getRate(){
    return response()->json(MemberShipServiceRate::join('membership_service_groups','membership_service_groups.id',
'=','member_ship_service_rates.service_type_id')->join('membership_plans','membership_plans.id','=','member_ship_service_rates.membership_plan_id')
// ->join('membership_types','membership_types.id','=','membership_plans.type_id')
->join('membership_types','membership_types.id','=','member_ship_service_rates.group_id')
->select('membership_service_groups.name as gname','membership_plans.name as mname',
'membership_types.type_name','membership_plans.fees','member_ship_service_rates.id','member_ship_service_rates.service_type_id',
'member_ship_service_rates.group_id')->get());
}


    // Store Membership Service Details
    public function memberShipServiceRate(Request $request) {
        $validated = $request->validate([
            'group_id' => 'nullable',
           'service_type_id' => 'nullable',
           'membership_plan_id' => 'nullable',
        //    'service_rate' => 'nullable|numeric',
        ]);

        $service = MemberShipServiceRate::create($validated);
        return response()->json(['message' => 'Service detail added successfully!', 'data' => $service], 201);
    }



    // Update Membership Service Details
    public function updateServiceRate(Request $request, $id) {
        $service = MemberShipServiceRate::find($id);
        if (!$service) {
            return response()->json(['error' => 'Service detail not found!'], 404);
        }

        $validated = $request->validate([
            'group_id' => 'nullable',
           'service_type_id' => 'nullable',
           'membership_plan_id' => 'nullable',
        //    'service_rate' => 'nullable|numeric',
        ]);

        $service->update($validated);
        return response()->json(['message' => 'Service detail updated successfully!', 'data' => $service]);
    }
    // Delete Membership Service Details
    public function deleteServiceRate($id) {
        $service = MemberShipServiceRate::find($id);
        if (!$service) {
            return response()->json(['error' => 'Service detail not found!'], 404);
        }

        $service->delete();
        return response()->json(['message' => 'Service detail deleted successfully!']);
    }

    public function membertypewiseload(Request $request,$id)
    {


        // Fetch membership plans based on member_id
        $plans = MembershipPlan::where('type_id', $id)->get();

        return response()->json($plans);
    }


    public function GroupTypeget(){
        return response()->json(MembershipType::all());
    }




  
}


