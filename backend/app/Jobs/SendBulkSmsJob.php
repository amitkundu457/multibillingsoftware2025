<?php

namespace App\Jobs;


use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use App\Models\Customer;
use App\Models\SmsCredential;
use App\Models\SmsSetting;
use App\Services\SmsService;
use Illuminate\Support\Facades\Log;



class SendBulkSmsJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

     protected $phones;
       protected $sms_credential_id;
    public function __construct($phones,$sms_credential_id = 9)
    {
                  $this->phones = $phones;
                  $this->sms_credential_id = $sms_credential_id;

    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {

        $smsService = new SmsService();

        $message = SmsSetting::where('status',"BULK_SMS")
            ->where('sms_credential_id', $this->sms_credential_id)
            ->value('description');

            $message = str_replace("\xC2\xA0", ' ', $message);

         if (!$message) {
            \Log::warning("Message not found for status {BULK_SMS}");
            return;
        }

            $credential = SmsCredential::find($this->sms_credential_id);

        if (!$credential) {
            \Log::warning("Credential not found for ID {$this->sms_credential_id}");
            return;
        }

        foreach($this->phones as $phone){
    try {
        $smsService->sendBillingSms($credential, $phone, $message,"BULK_SMS");
    } catch (\Exception $e) {
        \Log::error("Failed to send SMS to {$phone}: ".$e->getMessage());
    }
}



    }
}
