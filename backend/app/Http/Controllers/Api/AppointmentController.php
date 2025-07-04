<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use Illuminate\Http\Request;



use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Log;


class AppointmentController extends Controller
{
    /**
     * Store a newly created appointment in the database.
     */
    // public function store(Request $request)
    // {
    //     $customer = JWTAuth::parseToken()->authenticate();
    // Log::info('Authenticated Customer:', ['customer' => $customer]);
    //     // Validate the incoming request
    //     $validated = $request->validate([
    //         'appointment_date' => 'required|date',
    //         'appointment_time' => 'required|date_format:H:i',
    //         'name' => 'required|string|max:255',
    //         'phone' => 'required|string|max:20',
    //         'service' => 'required|string|max:255',
    //         'gender' => 'required|in:Male,Female,Other',
    //     ]);

    //     // Create the appointment and save to the database
    //     $appointment = Appointment::create($validated);

    //     // Return a successful response with the created appointment
    //     return response()->json([
    //         'message' => 'Appointment created successfully',
    //         'appointment' => $appointment
    //     ], 201);
    // }

    public function store(Request $request)
{
    $customer = JWTAuth::parseToken()->authenticate();
    Log::info('Authenticated Customer:', ['customer' => $request]);

    // Get all request data
    $data = $request->all();

    // Add the authenticated user's ID to the data
    $data['created_by'] = $customer->id;

    // Create the appointment and save to the database
    $appointment = Appointment::create($data);

    // Return a successful response with the created appointment
    return response()->json([
        'message' => 'Appointment created successfully',
        'appointment' => $appointment
    ], 201);
}


    /**
     * Display a listing of all appointments.
     */
    // public function index()
    // {
    //     // Get all appointments from the database
    //     $appointments = Appointment::all();

    //     // Return a successful response with the list of appointments
    //     return response()->json([
    //         'appointments' => $appointments
    //     ], 200);
    // }

    public function index()
{
    // Authenticate the user
    $customer = JWTAuth::parseToken()->authenticate();

    // Get only the appointments created by the authenticated user
    $appointments = Appointment::where('created_by', $customer->id)->get();

    // Return a successful response with the filtered list of appointments
    return response()->json([
        'appointments' => $appointments
    ], 200);
}

    /**
     * Display a specific appointment by its ID.
     */
    public function show($id)
    {
        // Find the appointment by its ID
        $appointment = Appointment::find($id);

        // If appointment is not found, return a 404 error
        if (!$appointment) {
            return response()->json([
                'message' => 'Appointment not found'
            ], 404);
        }

        // Return the appointment details
        return response()->json([
            'appointment' => $appointment
        ], 200);
    }

    /**
     * Update an existing appointment by its ID.
     */
    // public function update(Request $request, $id)
    // {
    //     // Find the appointment by its ID
    //     $appointment = Appointment::find($id);

    //     // If appointment is not found, return a 404 error
    //     if (!$appointment) {
    //         return response()->json([
    //             'message' => 'Appointment not found'
    //         ], 404);
    //     }

    //     // Validate the incoming request for updates
    //     $validated = $request->validate([
    //         'appointment_date' => 'sometimes|nullable|date',
    //         // 'appointment_time' => 'sometimes|nullable|date_format:H:i',
    //         // 'appointment_time' => 'sometimes|nullable|date_format:H:i:s',
    //         'appointment_time' => 'sometimes|nullable|date_format:H:i',
    //         // 'appointment_time' => 'sometimes|nullable|date_format:H:i:s', // <-- Accepts 14:09:00
    //         'name' => 'sometimes|nullable|string|max:255',
    //         'phone' => 'sometimes|nullable|string|max:20',
    //         'service' => 'sometimes|nullable|string|max:255',
    //         'gender' => 'sometimes|nullable|in:Male,Female,Other',
    //     ]);

    //     // Update the appointment with the validated data
    //     $appointment->update($validated);

    //     // Return a successful response with the updated appointment
    //     return response()->json([
    //         'message' => 'Appointment updated successfully',
    //         'appointment' => $appointment
    //     ], 200);
    // }


    public function update(Request $request, $id)
{
    $appointment = Appointment::find($id);

    if (!$appointment) {
        return response()->json([
            'message' => 'Appointment not found'
        ], 404);
    }

    // Normalize time to H:i
    if ($request->has('appointment_time') && $request->appointment_time) {
        $time = $request->appointment_time;

        if (preg_match('/^\d{2}:\d{2}:\d{2}$/', $time)) {
            $request->merge([
                'appointment_time' => date('H:i', strtotime($time))
            ]);
        }
    }

    $validated = $request->validate([
        'appointment_date' => 'sometimes|nullable|date',
        'appointment_time' => 'sometimes|nullable|date_format:H:i',
        'name' => 'sometimes|nullable|string|max:255',
        'phone' => 'sometimes|nullable|string|max:20',
        'service' => 'sometimes|nullable|string|max:255',
        'gender' => 'sometimes|nullable|in:Male,Female,Other',
        'stylist' => 'sometimes|nullable|string|max:255',
    ]);

    $appointment->update($validated);

    return response()->json([
        'message' => 'Appointment updated successfully',
        'appointment' => $appointment
    ], 200);
}


    /**
     * Remove an appointment from the database.
     */
    public function destroy($id)
    {
        // Find the appointment by its ID
        $appointment = Appointment::find($id);

        // If appointment is not found, return a 404 error
        if (!$appointment) {
            return response()->json([
                'message' => 'Appointment not found'
            ], 404);
        }

        // Delete the appointment
        $appointment->delete();

        // Return a successful response
        return response()->json([
            'message' => 'Appointment deleted successfully'
        ], 200);
    }
}
