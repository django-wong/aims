<?php

namespace App\Notifications;

use App\Models\Timesheet;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\HtmlString;

/**
 * @uses \App\Models\Client::routeNotificationForMail()
 */
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
     * TODO: Change the link to point to the timesheet so client can directly approve/reject from there.
     * TODO: Add inspection report as attachment if available.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $first_responder = $this->timesheet->assignment->operation_coordinator ?? $this->timesheet->assignment->coordinator;

        $message = (new MailMessage)
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

        $message->attach(
            new \App\PDFs\Timesheet($this->timesheet)
        );

        if ($first_responder) {
            $message->replyTo($first_responder->email, $first_responder->name);
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
