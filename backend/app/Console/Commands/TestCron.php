<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class TestCron extends Command
{
    protected $signature = 'app:test-cron';
    protected $description = 'Test if Laravel cron scheduler is running properly';

    public function handle()
    {
        Log::info('✅ Test cron ran successfully at ' . now()->format('Y-m-d H:i:s'));
        $this->info('Test cron executed successfully!');
    }
}
