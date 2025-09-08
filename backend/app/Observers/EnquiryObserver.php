<?php

namespace App\Observers;

use App\Models\Enquiry;
use App\Models\SmsSetting;
use App\Models\SmsCredential;
use App\Models\FollowUp;

use App\Services\SmsService;


class EnquiryObserver
{

    protected  $smsService;

    public function __construct(SmsService $smsService)
    {
        $this->smsService = $smsService;
    }
    public function created(Enquiry $enquiry): void
    {
        //
        FollowUp:: create([
            'enquiry_id'=>$enquiry->id,
            'follow_up_date'=>$enquiry->date,
            'notes'=>$enquiry->description

        ]);
        $phone = $enquiry->phone;
        $sms_credential_id = 1;
         $status = "follow-Up";
        $message = SmsSetting::where('status', $status)
    ->where('sms_credential_id', $sms_credential_id)
    ->where('created_by',$enquiry->created_by)
    ->value('description');

    $message = str_replace("\xC2\xA0", ' ', $message);

    if (!$message) {
        \Log::error("message not found".$message);
     }


         $credential = SmsCredential::find($sms_credential_id);

         if (!$credential) {
        \Log::error("credential not found".$credential);
     }
       $this->smsService->sendBillingSms($credential,$phone,$message,$status);



    }

    /**
     * Handle the Enquiry "updated" event.
     */
    public function updated(Enquiry $enquiry): void
    {
        //
    }

    /**
     * Handle the Enquiry "deleted" event.
     */
    public function deleted(Enquiry $enquiry): void
    {
        //
    }

    /**
     * Handle the Enquiry "restored" event.
     */
    public function restored(Enquiry $enquiry): void
    {
        //
    }

    /**
     * Handle the Enquiry "force deleted" event.
     */
    public function forceDeleted(Enquiry $enquiry): void
    {
        //
    }
}
