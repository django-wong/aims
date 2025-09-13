<?php

namespace App\Notifications;

use App\Models\Timesheet;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class TimesheetRejected extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(private readonly Timesheet $timesheet)
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
            ->view('email')
            ->line("Your timesheet for assignment {$this->timesheet->assignment->reference_number} has been rejected. Please review and make necessary changes.")
            ->line('Rejection Reason: ' . $this->timesheet->rejection_reason)
            ->action(
                'View Assignment', route('assignments.edit', $this->timesheet->assignment_id)
            );

        $assignment = $this->timesheet->assignment;

        if ($assignment->coordinator) {
            $message->cc(
                $assignment->coordinator->email, $assignment->coordinator->name
            );
        }

        if ($assignment->operation_coordinator) {
            $message->cc(
                $assignment->operation_coordinator->email,
                $assignment->operation_coordinator->name
            );
        }

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
