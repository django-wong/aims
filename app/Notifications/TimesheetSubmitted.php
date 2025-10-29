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

        $message->attach(
            new \App\PDFs\Timesheet($this->timesheet)
        );

        if ($operation_coordinator = $this->timesheet->assignment->operation_coordinator) {
            if ($operation_coordinator->is($notifiable)) {
                $coordinator = $this->timesheet->assignment->coordinator;
                if ($coordinator) {
                    $message->cc(
                        $coordinator->email, $coordinator->name
                    );
                }
            }
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
