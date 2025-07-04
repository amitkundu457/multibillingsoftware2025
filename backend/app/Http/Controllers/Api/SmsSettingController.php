<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use App\Models\SmsSetting;
class SmsSettingController extends Controller
{

 public function store(Request $request)
{
    $user = JWTAuth::parseToken()->authenticate();

    $validated = $request->validate([
        'description' => 'nullable|string',
        'status' => 'required|string',
        'sms_credential_id' => 'required|exists:sms_credentials,id',
        'template_id' => 'required|string',
    ]);

    // Find existing setting for this vendor + status
    $sms = SmsSetting::where('status', $validated['status'])
        ->where('sms_credential_id', $validated['sms_credential_id'])
        ->first();

    if (empty($validated['description'])) {
        if ($sms) {
            $sms->delete();
        }
        return response()->json([
            'message' => 'Message deleted (empty description)',
        ], 200);
    }

    if ($sms) {
        $sms->update([
            'description' => $validated['description'],
            'template_id' => $validated['template_id'],
            'created_by' => $user->id,
        ]);
    } else {
        $sms = SmsSetting::create([
            'description' => $validated['description'],
            'status' => $validated['status'],
            'sms_credential_id' => $validated['sms_credential_id'],
            'template_id' => $validated['template_id'],
            'created_by' => $user->id,
        ]);
    }

    return response()->json([
        'message' => 'Message saved',
        'data' => $sms,
    ], 200);
}




    // READ (optional: list by type/status)
   public function index(Request $request)
{
    $query = SmsSetting::query();

    if ($request->has('status')) {
        $query->where('status', $request->status);
    }

    if ($request->has('sms_credential_id')) {
        $query->where('sms_credential_id', $request->sms_credential_id);
    }

    return response()->json($query->latest()->get());
}


    // EDIT / UPDATE
    public function update(Request $request, $id)
    {
        $setting = SmsSetting::findOrFail($id);

        $setting->update([
            'description' => $request->description,
            'status' => $request->status,
        ]);

        return response()->json(['message' => 'Message setting updated', 'data' => $setting]);
    }

    // DELETE
    public function destroy($id)
    {
        $setting = SmsSetting::findOrFail($id);
        $setting->delete();

        return response()->json(['message' => 'Message setting deleted']);
    }

    // STATUS UPDATE (e.g., activate/deactivate a message)
    public function updateStatus(Request $request, $id)
    {
        $setting = SmsSetting::findOrFail($id);
        $setting->status = $request->status;
        $setting->save();

        return response()->json(['message' => 'Status updated', 'data' => $setting]);
    }
}
