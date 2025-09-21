<?php

namespace App\Notifications;

use App\Models\PurchaseOrder;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PurchaseOrderUsageReachedDefinedThreshold extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(private readonly PurchaseOrder $purchase_order, private readonly string $stage)
    {
        //
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Work Order Usage has exceeded your alert threshold')
            ->greeting('Hello')
            ->line('This is an alert that your work order "'.$this->purchase_order->title.'" has exceeded the defined usage threshold. Please review the work order to ensure that you stay within budget.')
            ->line('Threshold: '.$this->purchase_order->{$this->stage.'_alert_threshold'}.'%')
            ->line('Hours: '.$this->purchase_order->total_hours.' / '.$this->purchase_order->budgeted_hours)
            ->action(
                'View Work Order', route('purchase-orders.edit', $this->purchase_order->id)
            );
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}
