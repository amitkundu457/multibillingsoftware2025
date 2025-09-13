<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use App\Models\Appointment;

class AppointmentBooked
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

        public $appointment;
        public $status;
        public $sms_credential_id;

    public function __construct(Appointment $appointment,$status,$sms_credential_id)
    {
        //
                $this->appointment = $appointment;
                 $this->status = $status;
                $this->sms_credential_id = $sms_credential_id;


    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('channel-name'),
        ];
    }
}
