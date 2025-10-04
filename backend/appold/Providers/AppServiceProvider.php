<?php

namespace App\Providers;

use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Support\ServiceProvider;
use App\Models\KotBill;
use App\Observers\KotBillObserver;
use App\Models\ParcelBill;
use App\Observers\ParcelBillObserver;
use App\Models\Enquiry;
use App\Observers\EnquiryObserver;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        ResetPassword::createUrlUsing(function (object $notifiable, string $token) {
            return config('app.frontend_url')."/password-reset/$token?email={$notifiable->getEmailForPasswordReset()}";
        });

            KotBill::observe(KotBillObserver::class);
             ParcelBill::observe(ParcelBillObserver::class);
                 Enquiry::observe(EnquiryObserver::class);


    }
}
