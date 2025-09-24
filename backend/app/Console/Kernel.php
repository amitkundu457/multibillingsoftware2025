<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * Define the application's command schedule.
     */
    protected function schedule(Schedule $schedule): void
    {
    $schedule->command('queue:work --once')->everyMinute();
     $schedule->command('send:send-birthday-anniversary-wishes')->dailyAt('12:00');
      $schedule->command('app:check-b-b-l-c')->everyMinute();
      $schedule->command('app:followups-reminders')->dailyAT('00:00');


    }

    /**
     * Register the commands for the application.
     */
    protected function commands(): void
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}
