<?php

namespace App\Http\Controllers\Api;

use App\Models\Reminder;
use App\Models\ReminderSlot;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class ReminderSlotController extends Controller
{
    public function index()
    {
        $reminders = ReminderSlot::latest()->get();
        return response()->json($reminders);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'days' => 'required|array',
            'target' => 'required|string',
            'send_time' => 'required',
            'enabled' => 'boolean'
        ]);

        $createdReminders = [];

        foreach ($validated['days'] as $day) {
            $reminder = ReminderSlot::create([
                'name' => $validated['name'],
                'days' => [$day],
                'target' => $validated['target'],
                'send_time' => $validated['send_time'],
                'enabled' => $validated['enabled'] ?? true
            ]);
            $createdReminders[] = $reminder;
        }

        return response()->json([
            'message' => 'Reminders created successfully',
            'reminders' => $createdReminders
        ]);
    }

    public function show(ReminderSlot $reminder)
    {
        return response()->json($reminder);
    }

    public function update(Request $request, ReminderSlot $reminder)
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'days' => 'sometimes|array',
            'target' => 'sometimes|string',
            'send_time' => 'sometimes',
            'enabled' => 'sometimes|boolean'
        ]);

        $reminder->update($validated);

        return response()->json(['message' => 'Reminder updated successfully', 'reminder' => $reminder]);
    }

    public function destroy(ReminderSlot $reminder)
    {
        $reminder->delete();

        return response()->json(['message' => 'Reminder deleted successfully']);
    }
}
