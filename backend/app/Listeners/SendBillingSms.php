<?php

namespace App\Listeners;

use App\Events\OrderPlaced;
use Illuminate\Contracts\Queue\ShouldQueue;
use App\Jobs\SendBillingSmsJob;

use Illuminate\Queue\InteractsWithQueue;

class SendBillingSms
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

     public function handle(OrderPlaced $event){

        // SendBillingSmsJob::dispatch($event->phone_no,$event->status,$event->sms_credential_id);

        
     }
}
