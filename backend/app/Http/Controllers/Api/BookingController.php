<?php

namespace App\Http\Controllers\api;

 use Illuminate\Http\Request;
 use Illuminate\Support\Facades\Http;

use App\Models\Booking;
use Illuminate\Support\Facades\Validator;

use App\Models\SmsSetting;
use App\Models\SmsCredential;
use App\Models\Customer;
use App\Http\Controllers\Controller;


class BookingController extends Controller
{
    //


        // Store Booking
        public function store(Request $request) {
            $validator = Validator::make($request->all(), [
                'entry_date'     => 'nullable|date',
                'booking_no'     => 'nullable|',
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
                'service'  =>'nullable|array',
            //      'status' => 'required',
            // 'sms_credential_id' => 'required',
            ]);

            if ($validator->fails()) {
                return response()->json(['error' => $validator->errors()], 422);
            }
             $data = $request->all();

        // Convert array of services to comma-separated string
        if (is_array($data['service'] ?? null)) {
            $data['service'] = implode(', ', $data['service']);
        }

            $booking = Booking::create($data);
           $this->sendBillingSms($request->phone,"Saloon Booking",1);

            return response()->json([
                'message' => 'Booking created successfully!',
                'data'    => $booking
            ], 201);
        }


        public function sendBillingSms($phone_no,$status,$sms_credential_id)
{


    // 🔍 Find customer by phone
    $customer = Customer::where('phone', $phone_no)->first();
    if (!$customer) {
        return response()->json(['message' => 'Customer not found with this phone number'], 404);
    }

    // 🔍 Get message from sms_settings table
    // $message = SmsSetting::where('status', $request->status)
    //     ->where('sms_credential_id', $request->sms_credential_id)
    //     ->value('description');
    $message = SmsSetting::where('status', $status)
    ->where('sms_credential_id', $sms_credential_id)
    ->value('description');

// 🧼 Clean non-breaking spaces (e.g., \u00a0)
$message = str_replace("\xC2\xA0", ' ', $message);

    if (!$message) {
        return response()->json(['message' => 'Message not found for this status'], 404);
    }

    // 🔍 Get SMS credential details
    $credential = SmsCredential::find($sms_credential_id);

    if (!$credential) {
        return response()->json(['message' => 'Credential not found'], 404);
    }
    // ✅ Send SMS
    $response = Http::get("https://sms.bluwaves.in/sendsms/bulk.php", [
        'username'    => $credential->sms_username,
        'password'    => $credential->sms_password,
        'type'        => 'TEXT',
        'sender'      => $credential->sms_sender,
        'mobile'      => $phone_no,
        'message'     => $message,
        'entityId'    => $credential->sms_entity_id,
        'templateId'  => SmsSetting::where('status', $status)
                          ->where('sms_credential_id', $sms_credential_id)
                          ->value('template_id')
    ]);

    return response()->json([
        'message' => 'SMS sent',
        'sms_response' => $response->body(),
    ]);
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
