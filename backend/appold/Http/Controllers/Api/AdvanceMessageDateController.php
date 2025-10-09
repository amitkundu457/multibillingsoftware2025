<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\AdvanceMessageDate;
use Tymon\JWTAuth\Facades\JWTAuth;

class AdvanceMessageDateController extends Controller
{
    //
    public function index(){
       $user =   JWTAuth::parseToken()->authenticate();
       $data =  AdvanceMessageDate::where('created_by',$user->id)->get();

       return response()->json([
        'data'=>$data,
        'message'=>'data fetch  successfully'
       ]);

    }

    public function store(Request $request){
       $user =  JWTAuth::parseToken()->authenticate();

        $request->validate([
            'birthdayAdvance'=>'nullable|integer',
            'anniversaryAdvance'=>'nullable|integer',
            'bblcAdvanceDate' =>'nullable|integer',
            'reminderAdvanceDate' => 'nullable|integer',


        ]);


       $data  =  AdvanceMessageDate::create([
            'birthdayAdvance'=>$request->birthdayAdvance,
            'anniversaryAdvance' =>$request->anniversaryAdvance,
            'bblcAdvanceDate' => $request->bblcAdvanceDate,
            'reminderAdvanceDate' => $request->reminderAdvanceDate,
            'created_by' =>$user->id


        ]);

        return response()->json([
            'data' =>$data,
            'message'=>'data created successfully'
        ]);

    }

    public function update(Request $request, $id){

         $data = AdvanceMessageDate::findOrFail($id);

      $data->update([
        'birthdayAdvance'=>$request->birthdayAdvance ?? $data->birthdayAdvance,
        'anniversaryAdvance'=>$request->anniversaryAdvance ?? $data->anniversaryAdvance,
        'bblcAdvanceDate'=>$request->bblcAdvanceDate ?? $data->bblcAdvanceDate,
        'reminderAdvanceDate'=>$request->reminderAdvanceDate ?? $data->reminderAdvanceDate,
    ]);

         return response()->json([
            'updated data' =>$data,
            'message'=>'data updated successfully'
         ]);





    }

    public function destroy($id){

        $data =  AdvanceMessageDate::findOrFail($id);
        $data->delete();

        return response()->json([
            ' deleted data'=>$data,
            'message'=>'data deleted successfully'
        ]);


    }
}
