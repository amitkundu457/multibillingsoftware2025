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

        $data = SmsSetting::create([
            'description' => $request->description,
            'status' => $request->status ?? 'upcoming_birthday', // default status/type
            'created_by' => $user->id,
        ]);

        return response()->json(['message' => 'Message setting created', 'data' => $data], 201);
    }

    // READ (optional: list by type/status)
    public function index(Request $request)
    {
        $query = SmsSetting::query();

        if ($request->has('status')) {
            $query->where('status', $request->status);
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
