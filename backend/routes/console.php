

<!-- use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote')->hourly(); --> -->



<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;
use Illuminate\Support\Facades\Log;

/*
|--------------------------------------------------------------------------
| Console Routes
|--------------------------------------------------------------------------
|
| This file is where you may define all of your closure-based console
| commands and scheduled tasks. Laravel 11 runs all scheduler definitions
| here automatically.
|
*/

// Example default command
Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote')->hourly();

// 🧭 Log every minute — to verify scheduler is working
Schedule::call(function () {
    Log::info('🧭 Scheduler running at ' . now());
})->everyMinute();

// 🧠 Run your test cron command every minute
// 🧩 Your scheduled commands
Schedule::command('queue:work --once')->everyMinute();

Schedule::command('send:send-birthday-anniversary-wishes')
    ->dailyAt('12:00');
Schedule::command('app:send-advanced-birthday-anniversary-wishes')->dailyAt('12:10')->timezone('Asia/Kolkata');
Schedule::command('app:check-b-b-l-c')
    ->dailyAt('00:00');

Schedule::command('app:followups-reminders')
    ->dailyAt('00:00');

Schedule::command('app:test-cron')
    ->everyMinute();
