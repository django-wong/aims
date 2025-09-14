<?php

namespace App\Notifications;

use App\Models\Assignment;
use App\Models\AssignmentInspector;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use PhpParser\Node\Expr\Assign;

class UpcomingAssignmentReminderForInspector extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(private readonly Assignment $assignment, private readonly AssignmentInspector $inspector)
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
            ->subject("Assignment {$this->assignment->reference_number} is starting tomorrow")
            ->greeting("Hello {$this->inspector->user->name},")
            ->line("This is a reminder that your assignment ({$this->assignment->reference_number}) is scheduled to start tomorrow ({$this->assignment->first_visit_date->format('Y-m-d')}). Please ensure you are prepared and have all necessary materials ready.")
            ->action(
                'View Assignment', route('assignments.edit', $this->assignment->id)
            );

        if ($this->assignment->coordinator) {
            $message->cc(
                $this->assignment->coordinator->email, $this->assignment->coordinator->name
            );
        }

        if ($this->assignment->operation_coordinator) {
            $message->cc(
                $this->assignment->operation_coordinator->email,
                $this->assignment->operation_coordinator->name
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
