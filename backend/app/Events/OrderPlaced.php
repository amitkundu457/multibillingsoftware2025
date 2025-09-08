<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use App\Models\SaloonOrder;

class OrderPlaced
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

     public $phone_no;
     public $status;
     public $sms_credential_id;
    public function __construct( $phone_no,$status , $sms_credential_id )
    {
        $this->phone_no = $phone_no;
        $this->status = $status;
        $this->sms_credential_id  = $sms_credential_id;


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
