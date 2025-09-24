<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\BblcSlot;

class BBLcController extends Controller
{
 public function index()
    {
        return response()->json(BblcSlot::all());
    }

    
   public function storeMonthlySlots(Request $request)
{
    $request->validate([
        'month' => 'required|integer|min:1|max:12',
        'year' => 'required|integer|min:2000',
        'slot_days' => 'required|array', // e.g., [5,15,25]
        'notification_days' => 'required|array', // e.g., [10,5]
    ]);

    $month = $request->month;
    $year = $request->year;
    $slot_days = $request->slot_days;
    $notification_days = $request->notification_days;

    $slots = [];

    foreach ($slot_days as $i => $day) {
        $slotDate = date('Y-m-d', strtotime("$year-$month-$day"));

        $notifyDates = [];
        foreach ($notification_days as $index => $daysBefore) {
            $notifyDates[$index] = date('Y-m-d', strtotime("$slotDate -$daysBefore days"));
        }

        $slot = BblcSlot::create([
            'slot_name' => "Slot " . ($i + 1),
            'slot_date' => $slotDate,
            'notify_10_days' => $notifyDates[0] ?? null,
            'notify_5_days' => $notifyDates[1] ?? null,
        ]);

        $slots[] = $slot;
    }

    return response()->json($slots, 201);
}



    // single slot show
    public function show($id)
    {
        $slot = BblcSlot::findOrFail($id);
        return response()->json($slot);
    }

    // update slot
    public function update(Request $request, $id)
    {
        $slot = BblcSlot::findOrFail($id);

        $slot->update($request->only(['slot_date', 'slot_name']));

        return response()->json($slot);
    }

    // delete slot
    public function destroy($id)
    {
        $slot = BblcSlot::findOrFail($id);
        $slot->delete();

        return response()->json(['message' => 'Slot deleted successfully']);
    }
}
