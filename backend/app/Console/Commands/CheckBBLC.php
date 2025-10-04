<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
 use App\Models\SmsSetting;
  use App\Models\CustomerLastOrder;
use Illuminate\Support\Facades\Log; // <-- add this

use App\Models\SmsCredential;
use App\Models\Customer;
use App\Models\BBLCSlot;

use App\Services\SmsService;


class CheckBBLC extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:check-b-b-l-c';

    protected $description = 'BBLC notification send to the customer';

        protected $smsService;


    /**
     * Execute the console command.
     */

    public function __construct(SmsService $smsService)
    {
         parent::__construct();
         $this->smsService = $smsService;
    }
   public function handle()
{
    // ✅ Get enabled slots
    $slots = BBLCSlot::where('enabled', true)->get();

    foreach ($slots as $slot) {
         $now = now();
 


        if ($now->format('H:i') == Carbon::parse($slot->send_time)->format('H:i')) {

            // ✅ Loop all customers
            $customers = CustomerLastOrder::join('customers', 'customers.id', '=', 'customer_last_orders.customer_id')
                ->select('customers.phone', 'customer_last_orders.*')
                ->get();


            foreach ($customers as $customer) {
                // $daysDiff = Carbon::parse($customer->last_order_date)->diffInDays($now);
                $daysDiff = Carbon::parse($customer->last_order_date)->startOfDay()->diffInDays($now->startOfDay());



                // ✅ Check if today's day matches slot days
                if ($daysDiff==intVal($slot->days)) {
                     $status = "BBLC";
                    $sms_credential_id = 1;
                    $this->info("days match");

                    $credential = SmsCredential::find($sms_credential_id);
                    if (!$credential) {
                        \Log::error("credential not found");
                        continue;
                    }

                    $message = DB::table('sms_settings')
                        ->where('status', $status)
                        ->where('sms_credential_id', $sms_credential_id)
                        ->where('created_by', $customer->created_by)
                        ->value('description');

                    $message = str_replace("\xC2\xA0", ' ', $message);
                     Log::info("message not found");

                    if (!$message) {
                        \Log::error("message not found");
                        continue;
                    }

                    // ✅ Send SMS
                    $this->smsService->sendBillingSms($credential, $customer->phone, $message, $status);
                    $this->info("Message sent to ({$customer->phone}) for {$customer->vendor_type}");
                }
                else{
                    Log::info($daysDiff);
                    $this->info("DaysDiff: {$daysDiff}, Phone: {$slot->days}");

                }
            }
        }
    }
}


}
