<?php

namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;

use App\Models\Reminder;

use App\Models\FollowUp;
use Illuminate\Http\Request;
use Carbon\Carbon;

class ReminderAndFollowUpController extends Controller
{
    // Get all reminders and follow-ups
    public function index()
    {
        return response()->json([
            'reminders' => Reminder::all(),
            'followUps' => FollowUp::all(),
        ]);
    }

    // Store a new reminder
    public function storeReminder(Request $request)
    {
        $request->validate([
            'enquiry_id' => 'required|exists:enquiries,id',
            'reminder_date' => 'required|date',
            'note' => 'nullable|string',
        ]);

        $reminder = Reminder::create($request->all());
        return response()->json(['message' => 'Reminder created successfully', 'data' => $reminder]);
    }

    // Store a new follow-up
    public function storeFollowUp(Request $request)
    {
        $request->validate([
            'enquiry_id' => 'required|exists:enquiries,id',
            'follow_up_date' => 'required|date',
            'notes' => 'nullable|string',
        ]);

        $followUp = FollowUp::create($request->all());
        return response()->json(['message' => 'Follow-up created successfully', 'data' => $followUp]);
    }

    // Get today's reminders and follow-ups count
    public function getTodayCounts()
    {
        $today = Carbon::today()->toDateString();

        $todayRemindersCount = Reminder::whereDate('reminder_date', $today)->count();
        $todayFollowUpsCount = FollowUp::whereDate('follow_up_date', $today)->count();

        return response()->json([
            'today_reminders' => $todayRemindersCount,
            'today_follow_ups' => $todayFollowUpsCount
        ]);
    }

    // Delete a reminder
    public function deleteReminder($id)
    {
        $reminder = Reminder::findOrFail($id);
        $reminder->delete();

        return response()->json(['message' => 'Reminder deleted successfully']);
    }

    // Delete a follow-up
    public function deleteFollowUp($id)
    {
        $followUp = FollowUp::findOrFail($id);
        $followUp->delete();

        return response()->json(['message' => 'Follow-up deleted successfully']);
    }
}
