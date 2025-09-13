<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use App\Models\Customer;
use App\Models\SmsCredential;
use App\Models\SmsSetting;
use App\Models\SaloonOrder;
use App\Services\SmsService;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class SendBillingSmsJob implements ShouldQueue
{
     use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

     protected $phone_no;
    protected $status;
    protected $sms_credential_id;

    public function __construct( $phone_no, $status, $sms_credential_id)
    {
         $this->phone_no = $phone_no;
        $this->status = $status;
        $this->sms_credential_id = $sms_credential_id;
    }

    /**
     * Execute the job.
     */
    public function handle(SmsService $smsService)
    {
        //
       $customer =  Customer::where('phone',$this->phone_no)->first();

       if(!$customer){
         \log::warning("customer not found with phone,{$this->phone_no}");
       }

       $message = SmsSetting::where('status', $this->status)
            ->where('sms_credential_id', $this->sms_credential_id)
            ->value('description');

         $message = str_replace("\xC2\xA0", ' ', $message);

         if (!$message) {
            \Log::warning("Message not found for status {$this->status}");
            return;
        }

        $credential = SmsCredential::find($this->sms_credential_id);
        if (!$credential) {
            \Log::warning("Credential not found for ID {$this->sms_credential_id}");
            return;
        }

    $smsService->sendBillingSms($credential, $this->phone_no, $message, $this->status);



    }
}
