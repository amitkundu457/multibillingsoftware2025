<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Booking;
use Illuminate\Support\Facades\Validator;



class BookingController extends Controller
{
    //


        // Store Booking
        public function store(Request $request) {
            $validator = Validator::make($request->all(), [
                'entry_date'     => 'nullable|date',
                'booking_no'     => 'nullable|unique:bookings',
                'booking_date'   => 'nullable|date',
                'booking_time'   => 'nullable|date_format:H:i',
                'phone'          => 'nullable|string|max:15',
                'customer_name'  => 'nullable|string|max:255',
                'address'        => 'nullable|string',
                'source'         => 'nullable|string',
                'out_of_salon'   => 'nullable|boolean',
                'rate'           => 'nullable|numeric',
                'discount'       => 'numeric',
                'total_price'    => 'nullable|numeric',
                'cash_payment'   => 'numeric',
                'card_payment'   => 'numeric',
                'upi_payment'    => 'numeric',
                'coupon_amount'  => 'numeric',
            ]);

            if ($validator->fails()) {
                return response()->json(['error' => $validator->errors()], 422);
            }

            $booking = Booking::create($request->all());

            return response()->json([
                'message' => 'Booking created successfully!',
                'data'    => $booking
            ], 201);
        }

        // Fetch All Bookings
        public function index() {
            $bookings = Booking::all();
            return response()->json($bookings);
        }

        // Fetch Single Booking
        public function show($id) {
            $booking = Booking::find($id);

            if (!$booking) {
                return response()->json(['message' => 'Booking not found'], 404);
            }

            return response()->json($booking);
        }

        // Update Booking
        public function update(Request $request, $id) {
            $booking = Booking::find($id);

            if (!$booking) {
                return response()->json(['message' => 'Booking not found'], 404);
            }

            $booking->update($request->all());

            return response()->json([
                'message' => 'Booking updated successfully!',
                'data'    => $booking
            ]);
        }

        // Delete Booking
        public function destroy($id) {
            $booking = Booking::find($id);

            if (!$booking) {
                return response()->json(['message' => 'Booking not found'], 404);
            }

            $booking->delete();

            return response()->json(['message' => 'Booking deleted successfully!']);
        }

}
