<?php

namespace App\Notifications;

use App\Models\Invoice;
use App\Models\InvoiceDetail;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\HtmlString;

class InvoiceReminder extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(private readonly Invoice $invoice)
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
            ->view('email')
            ->subject('You have pending invoice from ' . $this->invoice->org->name)
            ->greeting('Hello ' . $notifiable->name)
            ->line('This is a reminder that you have new invoice issued from ' . $this->invoice->org->name . '. Please take the necessary actions.')
            ->line(
                new HtmlString(
                    view(
                        'invoices.summary', [
                            'invoice' => InvoiceDetail::query()->find($this->invoice->id)
                        ]
                    )
                )
            )
            ->action('View Invoice', route('invoices.edit', $this->invoice->id));
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
