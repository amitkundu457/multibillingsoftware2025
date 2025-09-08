<?php

namespace App\Observers;

use App\Models\ParcelBill;
 use App\Models\SmsSetting;
use App\Models\SmsCredential;
use App\Models\Customer;

use App\Services\SmsService;

class ParcelBillObserver
{
    /**
     * Handle the ParcelBill "created" event.
     *
     */
    protected $smsService;
    private $customer_id;

    public function __construct(SmsService $smsService)
    {
        $this->smsService = $smsService;
    }


    public function created(ParcelBill $parcelBill): void
    {
        //
         $this->customer_id = $parcelBill->customer_id;
       $phone =  Customer::where('id',$this->customer_id)->value('phone');
        $status = "parcel billing";
       $sms_credential_id = 1;


       // 🔍 Find customer by phone
    $customer = Customer::where('phone', $phone)->first();
    if (!$customer) {
      \Log::error("Customer not found with phone: " . $phone);
       return;
  }


    $message = SmsSetting::where('status', $status)
    ->where('sms_credential_id', $sms_credential_id)
    ->value('description');

// 🧼 Clean non-breaking spaces (e.g., \u00a0)
$message = str_replace("\xC2\xA0", ' ', $message);

    if (!$message) {
        \Log::error("message not found".$message);
     }

    // 🔍 Get SMS credential details
    $credential = SmsCredential::find($sms_credential_id);

    if (!$credential) {
        \Log::error("credential not found".$credential);
     }
       $this->smsService->sendBillingSms($credential,$phone,$message,$status);
    }


    /**
     * Handle the ParcelBill "updated" event.
     */
    public function updated(ParcelBill $parcelBill): void
    {
        //
    }

    /**
     * Handle the ParcelBill "deleted" event.
     */
    public function deleted(ParcelBill $parcelBill): void
    {
        //
    }

    /**
     * Handle the ParcelBill "restored" event.
     */
    public function restored(ParcelBill $parcelBill): void
    {
        //
    }

    /**
     * Handle the ParcelBill "force deleted" event.
     */
    public function forceDeleted(ParcelBill $parcelBill): void
    {
        //
    }
}
