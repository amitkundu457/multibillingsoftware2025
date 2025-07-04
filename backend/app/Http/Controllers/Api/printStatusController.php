<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\printStatus;

class printStatusController extends Controller
{
    //
    public function index(){

        $status = printStatus::all();
        return response()->json($status);

    }
}
