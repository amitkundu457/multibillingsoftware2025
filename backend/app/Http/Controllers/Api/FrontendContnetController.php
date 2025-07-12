<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\FrontendSetting;

class FrontendContnetController extends Controller
{
    public function crmcontent(){
        return  FrontendSetting::where('type','crm')->first();
    }

    //   public function storeOrUpdate(Request $request)
    // {
    //     $request->validate([
    //         'type' => 'required|string',
    //         'description' => 'required|string',
    //     ]);

    //     $setting = FrontendSetting::updateOrCreate(
    //         ['type' => $request->type],
    //         ['description' => $request->description]
    //     );

    //     return response()->json(['message' => 'Saved successfully.', 'data' => $setting]);
    // }


    public function show($type)
{
    $setting = FrontendSetting::where('type', $type)->first();

    if (!$setting || trim($setting->description) === '') {
        return response()->json([
            'message' => 'No content found for this type.',
            'type' => $type,
            'description' => null,
        ], 404);
    }

    return response()->json($setting);
}


    // Store or update content
    public function storeOrUpdate(Request $request)
    {
        $request->validate([
            'type' => 'required|string',
            'description' => 'required|string',
        ]);

        $setting = FrontendSetting::updateOrCreate(
            ['type' => $request->type],
            ['description' => $request->description]
        );

        return response()->json(['message' => 'Saved successfully.', 'data' => $setting]);
    }



}
