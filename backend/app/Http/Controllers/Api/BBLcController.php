<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\BblcSlot;

class BBLcController extends Controller
{
    public function index()
    {
        $slots = BBLCSlot::latest()->get();
        return response()->json($slots);
    }

   public function store(Request $request)
{
    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'days' => 'required|array', // ["4","5","6"]
        'target' => 'required|string',
        'send_time' => 'required',
        'enabled' => 'boolean'
    ]);

    $createdSlots = [];

    foreach ($validated['days'] as $day) {
        $slot = BBLCSlot::create([
            'name' => $validated['name'],
            'days' => [$day], // ekta ekta kore store
            'target' => $validated['target'],
            'send_time' => $validated['send_time'],
            'enabled' => $validated['enabled'] ?? true
        ]);
        $createdSlots[] = $slot;
    }

    return response()->json([
        'message' => 'Slots created successfully',
        'slots' => $createdSlots
    ]);
}


    public function show(BBLCSlot $bblcslot)
    {
        return response()->json($bblcslot);
    }

    public function update(Request $request, BBLCSlot $bblcslot)
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'days' => 'sometimes|array',
            'target' => 'sometimes|string',
            'send_time' => 'sometimes',
            'enabled' => 'sometimes|boolean'
        ]);

        $bblcslot->update($validated);

        return response()->json(['message' => 'Slot updated successfully', 'slot' => $bblcslot]);
    }

    public function destroy(BBLCSlot $bblcslot)
    {
        $bblcslot->delete();

        return response()->json(['message' => 'Slot deleted successfully']);
    }
}
