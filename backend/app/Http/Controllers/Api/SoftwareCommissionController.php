<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\SoftwareCommission;

class SoftwareCommissionController extends Controller
{
    public function index()
    {

    }

    public function store()
    {
        SoftwareCommission::create([
            
        ]);
    }
}
