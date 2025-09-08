<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Customer;
use Carbon\Carbon;

use App\Services\SmsService;
use App\Models\SmsSetting;
use App\Models\SmsCredential;


class SendBirthdayAnniversaryWishes extends Command
{

    protected $signature = 'send:send-birthday-anniversary-wishes';

    protected $description = "Send birthday and anniversary messages to customers";

     protected $smsService;

    public function __construct(SmsService $smsService)
    {
         parent::__construct();

        $this->smsService = $smsService;
    }

    public function handle()
    {

        $today = Carbon::today()->format('m-d');
        $nextWeek = Carbon::today()->addWeek()->format('m-d');

        $birthdayStatus ="Birthday message";
         $anniversaryStatus  = "anniversary message";
        $sms_credential_id = 1;

//         $birthdayMessage = SmsSetting::where('status', $birthdayStatus)
//     ->where('sms_credential_id', $sms_credential_id)
//      ->value('description');


//     $AnniversaryMessage = SmsSetting::where('status', $AnniversaryStatus)
//     ->where('sms_credential_id',$sms_credential_id)
//      ->value('description');

//     // 🧼 Clean non-breaking spaces (e.g., \u00a0)
// $birthdayMessage = str_replace("\xC2\xA0", ' ', $birthdayMessage);

//     if (!$birthdayMessage) {
//         \Log::error("message not found".$birthdayMessage);
//      }

     $credential = SmsCredential::find($sms_credential_id);

    if (!$credential) {
        \Log::error("credential not found".$credential);
     }

        // Birthday today
        $birthdays = Customer::whereRaw("DATE_FORMAT(dob, '%m-%d') = ?", [$today])->get();

        // Anniversary today
        $anniversaries = Customer::whereRaw("DATE_FORMAT(anniversary, '%m-%d') = ?", [$today])->get();

        // Birthday in next 7 days
        $upcomingBirthdays = Customer::whereRaw("DATE_FORMAT(dob, '%m-%d') = ?", [$nextWeek])->get();

        // Anniversary in next 7 days
        $upcomingAnniversaries = Customer::whereRaw("DATE_FORMAT(anniversary, '%m-%d') = ?", [$nextWeek])->get();

        // foreach ($birthdays as $customer) {
        //     $this->smsService->sendBillingSms($credential,$customer->phone, $birthdayMessage,$birthdayStatus);
        // }

        // foreach ($anniversaries as $customer) {
        //     $this->smsService->sendBillingSms($credential,$customer->phone, $AnniversaryMessage,$AnniversaryStatus);
        // }

        // foreach ($upcomingBirthdays as $customer) {
        //     $this->smsService->sendBillingSms($credential,$customer->phone, $birthdayMessage,$birthdayStatus);
        // }

        // foreach ($upcomingAnniversaries as $customer) {
        //     $this->smsService->sendBillingSms($credential,$customer->phone, $AnniversaryMessage,$AnniversaryStatus);
        // }

        foreach ($birthdays as $customer) {
            $birthdayMessage = SmsSetting::where('status', $birthdayStatus)
                ->where('sms_credential_id', $sms_credential_id)
                ->where('created_by', $customer->created_by) // ✅ FIXED
                ->value('description');

            if ($birthdayMessage && $customer->phone) {
                $this->smsService->sendBillingSms($credential, $customer->phone, $birthdayMessage, $birthdayStatus);
            }
        }

        foreach ($anniversaries as $customer) {
            $anniversaryMessage = SmsSetting::where('status', $anniversaryStatus)
                ->where('sms_credential_id', $sms_credential_id)
                ->where('created_by', $customer->created_by)
                ->value('description');

            if ($anniversaryMessage && $customer->phone) {
                $this->smsService->sendBillingSms($credential, $customer->phone, $anniversaryMessage, $anniversaryStatus);
            }
        }

        // --- Upcoming Birthdays ---
        foreach ($upcomingBirthdays as $customer) {
            $birthdayMessage = SmsSetting::where('status', $birthdayStatus)
                ->where('sms_credential_id', $sms_credential_id)
                ->where('created_by', $customer->created_by)
                ->value('description');

            if ($birthdayMessage && $customer->phone) {
                $this->smsService->sendBillingSms($credential, $customer->phone, $birthdayMessage, $birthdayStatus);
            }
        }

        // --- Upcoming Anniversaries ---
        foreach ($upcomingAnniversaries as $customer) {
            $anniversaryMessage = SmsSetting::where('status', $anniversaryStatus)
                ->where('sms_credential_id', $sms_credential_id)
                ->where('created_by', $customer->created_by)
                ->value('description');

            if ($anniversaryMessage && $customer->phone) {
                $this->smsService->sendBillingSms($credential, $customer->phone, $anniversaryMessage, $anniversaryStatus);
            }
        }

        $this->info('Wishes sent successfully!');
    }
}
