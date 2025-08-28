<?php

namespace App\Notifications;

use App\Models\Timesheet;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\HtmlString;

class TimesheetIsWaitingForClientApproval extends Notification
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
            ->view('email')
            ->subject('Timesheet is waiting for your approval')
            ->greeting('Hello')
            ->line('A new timesheet has been submitted and is waiting for your approval. Please review the timesheet in assignment details and make further action from there.')
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
                'View Assignment',
                route(
                    'assignments.edit', [
                        'id' => $this->timesheet->assignment_id
                    ]
                )
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
