<?php
namespace App\Services;

use GuzzleHttp\Client;
use Illuminate\Support\Facades\Http;
use App\Models\SmsSetting;

class SmsService
{

    public function sendBillingSms($credential, $phone_no, $message, $status)
    {
        // 🔹 Step 1: Fetch template ID safely
        $templateId = SmsSetting::where('status', $status)
            ->where('sms_credential_id', $credential->id)
            ->where('created_by', $credential->created_by)
            ->value('template_id');

        // 🔹 Step 2: Check if template ID exists
        if (!$templateId) {
            Log::warning("❌ SMS not sent — Template ID not found", [
                'status' => $status,
                'sms_credential_id' => $credential->id,
                'created_by' => $credential->created_by,
                'mobile' => $phone_no,
            ]);
            return; // stop here, don’t send SMS
        }

        // 🔹 Step 3: Send SMS if template found
        $response = Http::get("https://sms.bluwaves.in/sendsms/bulk.php", [
            'username'  => $credential->sms_username,
            'password'  => $credential->sms_password,
            'type'      => 'TEXT',
            'sender'    => $credential->sms_sender,
            'mobile'    => $phone_no,
            'message'   => $message,
            'entityId'  => $credential->sms_entity_id,
            'templateId'=> $templateId,
        ]);

        // 🔹 Step 4: Log API response
        Log::info("✅ SMS Sent Response:", [
            'mobile' => $phone_no,
            'body' => $response->body(),
        ]);
    }
}
