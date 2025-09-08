<?php

namespace App\Notifications;

use App\Models\Assignment;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class AssignmentHasBeenDelegated extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(private readonly Assignment $assignment)
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
            ->subject('You have been delegated a new assignment ' . $this->assignment->reference_number)
            ->greeting('Hello ' . $notifiable->name)
            ->line("{$this->assignment->org->name} has delegated the assignment {$this->assignment->reference_number} to you.")
            ->line('Please review the assignment details, ensure you have received of all attachments')
            ->attachMany($this->assignment->attachments->toArray())
            ->action(
                'View Assignment', route('assignments.edit', $this->assignment->id)
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
