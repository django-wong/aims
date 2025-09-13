<?php

namespace App\Notifications;

use App\Models\Assignment;
use App\Models\AssignmentInspector;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Carbon;

class AssignmentReportLate extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(private Assignment $assignment, private AssignmentInspector $inspector)
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
            ->subject("Report Late Notice - {$this->assignment->reference_number}")
            ->line("The inspector {$this->inspector->user->name} has not submitted their inspection report for the assignment {$this->assignment->reference_number} for the last week.")
            ->line("Please follow up with them to ensure the report is submitted as soon as possible.");

        if ($this->assignment->operation_coordinator) {
            $message->cc($this->assignment->operation_coordinator->email);
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
