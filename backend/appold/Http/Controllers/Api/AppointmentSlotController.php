<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
 use App\Models\AppointmentSlot;

class AppointmentSlotController extends Controller
{
    //
      // Get all slots
    public function index()
    {
        return response()->json(AppointmentSlot::all());
    }

    // Store a slot
    public function store(Request $request)
    {
        $request->validate([
            'slot' => 'required|string|max:255',
        ]);

        $slot = AppointmentSlot::create([
            'slot' => $request->slot,
        ]);

        return response()->json($slot, 201);
    }

    // Update a slot
    public function update(Request $request, $id)
    {
        $slot = AppointmentSlot::findOrFail($id);

        $request->validate([
            'slot' => 'required|string|max:255',
        ]);

        $slot->update([
            'slot' => $request->slot,
        ]);

        return response()->json($slot);
    }

    // Delete a slot
    public function destroy($id)
    {
        $slot = AppointmentSlot::findOrFail($id);
        $slot->delete();

        return response()->json(['message' => 'Slot deleted successfully']);
    }
}
