<?php

namespace App\Notifications;

use App\Models\NotificationOfInspection;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NotificationOfInspectionAcceptedByCoordinator extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(private NotificationOfInspection $noi)
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
        $message = (new MailMessage)
            ->subject('Your inspection request has been accepted.')
            ->action('View Request', url('/notification-of-inspections/'.$this->noi->id))
            ->view(
                'emails.notification-of-inspection-accepted-by-coordinator', [
                    'noi' => $this->noi,
                    'notifiable' => $notifiable,
                ]
            );

        $message->attachMany($this->noi->attachments);

        return $message;
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
