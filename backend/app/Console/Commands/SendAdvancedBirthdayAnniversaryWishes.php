<?php

namespace App\Console\Commands;

use Carbon\Carbon;




use App\Models\Customer;
use App\Models\SmsSetting;
use App\Services\SmsService;
use App\Models\SmsCredential;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class SendAdvancedBirthdayAnniversaryWishes extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:send-advanced-birthday-anniversary-wishes';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */

public function handle()
{
    // ✅ 7 days ahead date — only month-day
    $targetDate = Carbon::today()->addDays(7)->format('m-d');
    Log::info("📅 Advance SMS Job started for date: {$targetDate}");

    $smsService = new SmsService();

    // ✅ Correct Query: birthday OR anniversary
    $customers = Customer::whereRaw("DATE_FORMAT(dob, '%m-%d') = ?", [$targetDate])
        ->orWhereRaw("DATE_FORMAT(anniversary, '%m-%d') = ?", [$targetDate])
        ->get();

    Log::info("👥 Found customers for ADVANCE notification: " . $customers->count());

    if ($customers->isEmpty()) {
        Log::info("✅ No customers found for {$targetDate}");
        return;
    }

    // Grouped by created_by
    $grouped = $customers->groupBy('created_by');
    Log::info("📦 Groups created: " . $grouped->count());

    foreach ($grouped as $createdBy => $customerGroup) {

        Log::info("🔍 Processing group for created_by={$createdBy}, customers=" . $customerGroup->count());

        // ✅ Fetch SMS templates
        $birthdayMessage = SmsSetting::where('status', 'Birthday message')
            ->where('created_by', $createdBy)
            ->value('description');

        $anniversaryMessage = SmsSetting::where('status', 'anniversary message')
            ->where('created_by', $createdBy)
            ->value('description');

        // ✅ Fetch credentials
        $credential = SmsCredential::where('created_by', $createdBy)->first();

        if (!$credential) {
            Log::warning("⚠️ No SMS credential found for user {$createdBy}");
            continue;
        }

        foreach ($customerGroup as $customer) {

            try {
                $phone = $customer->phone ?? null;

                // ✅ Advanced Birthday
                if ($customer->dob && date('m-d', strtotime($customer->dob)) === $targetDate) {

                    Log::info("🎂 Birthday matched for customer={$customer->id}, phone={$phone}");

                    if ($birthdayMessage && $phone) {
                        $smsService->sendBillingSms(
                            $credential,
                            $phone,
                            $birthdayMessage,
                            'Advanced Birthday'
                        );
                        Log::info("✅ Advanced Birthday SMS sent to {$phone}");
                    } else {
                        Log::warning("⚠️ Birthday SMS not sent to {$phone} (missing message/phone)");
                    }
                }

                // ✅ Advanced Anniversary
                if ($customer->anniversary && date('m-d', strtotime($customer->anniversary)) === $targetDate) {

                    Log::info("💍 Anniversary matched for customer={$customer->id}, phone={$phone}");

                    if ($anniversaryMessage && $phone) {
                        $smsService->sendBillingSms(
                            $credential,
                            $phone,
                            $anniversaryMessage,
                            'Advanced Anniversary'
                        );
                        Log::info("✅ Advanced Anniversary SMS sent to {$phone}");
                    } else {
                        Log::warning("⚠️ Anniversary SMS not sent to {$phone} (missing message/phone)");
                    }
                }

            } catch (\Exception $e) {
                Log::error("❌ Failed sending SMS: ".$e->getMessage());
            }
        }
    }

    Log::info("🏁 Advance SMS job completed successfully!");
}


}
