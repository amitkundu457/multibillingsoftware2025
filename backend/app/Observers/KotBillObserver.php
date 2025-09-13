<?php

namespace App\Observers;

use App\Models\KotBill;
use App\Models\SmsSetting;
use App\Models\SmsCredential;
use App\Models\Customer;

use App\Services\SmsService;

class KotBillObserver
{

    protected $smsService;
    private $customer_id;

    public function __construct(SmsService $smsService)
    {
        $this->smsService = $smsService;
    }
    /**
     *
     * Handle the KotBill "created" event.
     */
    public function created(KotBill $kotBill): void
    {

        // dd($kotBill->customer_id);
        $this->customer_id = $kotBill->customer_id;
       $phone =  Customer::where('id',$this->customer_id)->value('phone');
        $status = "table billing";
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
     * Handle the KotBill "updated" event.
     */
    public function updated(KotBill $kotBill): void
    {
        //
    }

    /**
     * Handle the KotBill "deleted" event.
     */
    public function deleted(KotBill $kotBill): void
    {
        //
    }

    /**
     * Handle the KotBill "restored" event.
     */
    public function restored(KotBill $kotBill): void
    {
        //
    }

    /**
     * Handle the KotBill "force deleted" event.
     */
    public function forceDeleted(KotBill $kotBill): void
    {
        //
    }
}
