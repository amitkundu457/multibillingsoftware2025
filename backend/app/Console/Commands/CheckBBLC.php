<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
 use App\Models\SmsSetting;
  use App\Models\CustomerLastOrder;

use App\Models\SmsCredential;
use App\Models\Customer;

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


         $customers = CustomerLastOrder::join('customers', 'customers.id', '=', 'customer_last_orders.customer_id')
            ->select( 'customers.phone', 'customer_last_orders.*')
            ->get();

        $status = "BBLC";

         $sms_credential_id = 1;





      // 🔍 Get SMS credential details
    $credential = SmsCredential::find($sms_credential_id);

    if (!$credential) {
        \Log::error("credential not found".$credential);
     }

        foreach ($customers as $customer) {




            if (Carbon::parse($customer->last_order_date)->diffInDays(now()) >= 30) {


                $message = DB::table('sms_settings')
                  ->where('status', 'BBLC')
                  ->where('sms_credential_id', 1)
                  ->where('created_by', $customer->created_by)->value('description');


          $message = str_replace("\xC2\xA0", ' ', $message);


       if (!$message) {
        \Log::error("message not found".$message);
        }


                if($message) {
              $this->smsService->sendBillingSms($credential,$customer->phone,$message,$status);

            $this->info("Message sent to  ({$customer->phone}) for {$customer->vendor_type}");
        }


            }
        }
    }


}
