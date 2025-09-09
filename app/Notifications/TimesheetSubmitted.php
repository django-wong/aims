<?php

namespace App\Notifications;

use App\Models\Timesheet;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\HtmlString;

class TimesheetSubmitted extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(private Timesheet $timesheet)
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
            ->subject('Timesheet submitted by inspector and waiting for your review')
            ->greeting('Hello')
            ->line("The inspector {$this->timesheet->user->name} has submitted a timesheet for assignment {$this->timesheet->assignment->reference_number}, please review and take the necessary actions.")
            ->line(
                new HtmlString(
                    view(
                        'timesheets.summary', [
                            'timesheet' => $this->timesheet
                        ]
                    )
                )
            )
            ->action(
                'View Assignment', route('assignments.edit', $this->timesheet->assignment_id)
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
