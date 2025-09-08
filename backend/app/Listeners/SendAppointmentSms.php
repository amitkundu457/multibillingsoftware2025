<?php

namespace App\Listeners;

use App\Events\AppointmentBooked;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
 use App\Services\SmsService;
 use App\Models\Customer;
use App\Models\SmsCredential;
use App\Models\SmsSetting;
use App\Models\SaloonOrder;

class SendAppointmentSms
{
        protected $smsService;

    public function __construct(SmsService $smsService)
    {
        //
                $this->smsService = $smsService;


    }

    /**
     * Handle the event.
     */
    public function handle(AppointmentBooked $event): void
    {
        //
                $appointment = $event->appointment;
              $phone = $appointment->phone;
              $status = $event->status;
              $sms_credential_id = $event->sms_credential_id;


               //
       $customer =  Customer::where('phone',$phone)->first();

       if(!$customer){
         \log::warning("customer not found with phone,{$phone}");
       }

       $message = SmsSetting::where('status', $status)
            ->where('sms_credential_id', $sms_credential_id)
            ->value('description');

         $message = str_replace("\xC2\xA0", ' ', $message);

         if (!$message) {
            \Log::warning("Message not found for status {$status}");
            return;
        }

        $credential = SmsCredential::find($sms_credential_id);
        if (!$credential) {
            \Log::warning("Credential not found for ID {$sms_credential_id}");
            return;
        }

       $this->smsService->sendBillingSms($credential, $phone, $message, $status);



    }
}
