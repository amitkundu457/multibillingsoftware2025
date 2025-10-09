<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\KotTable;
use Tymon\JWTAuth\Facades\JWTAuth;



class KotTableController extends Controller
{
    //
     public function index()
    {
         $user = JWTAuth::parseToken()->authenticate();

    $tables = KotTable::where('created_by', $user->id)->get();
     return response()->json([
            'status' => true,
            'message' => 'Tables fetched successfully.',
            'tables' => $tables
        ]);
    }

    public function store(Request $request)
    {
           $user = JWTAuth::parseToken()->authenticate();

        $request->validate([
            'table_no' => 'required',

        ]);

        $table = KotTable::create([
            'table_no' => $request->table_no,
            'created_by' => $user->id
        ]);

        return response()->json($table, 201);
    }

    public function destroy($id)
    {
        $table = KotTable::findOrFail($id);
        $table->delete();

        return response()->json(['message' => 'Table deleted successfully.']);
    }
}
