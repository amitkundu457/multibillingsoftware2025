<?php

namespace App\Console\Commands;
use Carbon\Carbon;
use  App\Services\SmsService;
   use App\Models\SmsSetting;
 use App\Models\SmsCredential;
  use App\Models\Enquiry;





use Illuminate\Console\Command;

class FollowupsReminders extends Command
{

    protected $signature = 'app:followups-reminders';

 protected $smsService;
    protected $description = ' Follow_ups message has been sent';

    public function __construct( SmsService $smsService){
        Parent::__construct();
        $this->smsService = $smsService;


          }

    public function handle()
    {


         $targetDate = Carbon::today()->subDays(7);


           $enquiries = Enquiry::whereDate('date', $targetDate)->get();

           $Status ="follow-Up_Reminder";
         $sms_credential_id = 1;

         foreach($enquiries as $enquiry){

             $message = SmsSetting::where('status', $Status)
    ->where('sms_credential_id', $sms_credential_id)
    ->where('created_by', $enquiry->created_by)
     ->value('description');

         }



    $message = str_replace("\xC2\xA0", ' ', $message);

    if (!$message) {
        \Log::error("message not found".$message);
     }

     $credential = SmsCredential::find($sms_credential_id);

    if (!$credential) {
        \Log::error("credential not found".$credential);
     }

           foreach ($enquiries as $enquiry) {
            if ($enquiry->phone) {
                $this->smsService->sendBillingSms($credential,$enquiry->phone, $message,$Status );

                $this->info("Reminder sent to {$enquiry->phone}");
            }
        }


    }
}
