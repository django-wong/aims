<?php

namespace App\Notifications;

use App\Models\NotificationOfInspection;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class InspectionRequestedByClient extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(private NotificationOfInspection $noi, private ?User $cc = null)
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
            ->subject('You have a new inspection request.')
            ->action('View Request', url('/notification-of-inspections/'.$this->noi->id))
            ->view(
                'emails.notification-of-inspection', [
                    'noi' => $this->noi,
                    'notifiable' => $notifiable,
                ]
            );


        if ($this->cc) {
            $message->cc($this->cc->email);
        }

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
