<?php

namespace App\Jobs;

use App\Models\PurchaseOrder;
use App\Notifications\PurchaseOrderUsageReachedDefinedThreshold;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Notification;

class MonitorPurchaseOrderUsage implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct(private readonly PurchaseOrder $purchase_order)
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $alert_stage = null;
        $usage = $this->purchase_order->usage * 100;

        foreach (['first', 'second', 'final'] as $stage) {
            $threshold = $this->purchase_order->{$stage.'_alert_threshold'};
            if ($threshold) {
                if ($usage >= $threshold && is_null($this->purchase_order->{$stage.'_alert_at'})) {
                    $this->purchase_order->{$stage.'_alert_at'} = now();
                    $this->purchase_order->save();
                    $alert_stage = $stage;
                }
            }
        }

        if ($alert_stage) {
            if ($coordinator = $this->purchase_order->project?->client?->coordinator) {
                Notification::send($coordinator, new PurchaseOrderUsageReachedDefinedThreshold($this->purchase_order, $alert_stage));
            }
        }
    }
}
