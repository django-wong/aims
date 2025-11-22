<?php

namespace App\Notifications;

use App\Models\Timesheet;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\HtmlString;

class ClientReminderForPendingApprovalTimesheet extends Notification
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
        return (new MailMessage)
            ->view('email')
            ->subject("Reminder for Pending Approval Timesheet")
            ->greeting("Hi {$notifiable->name}")
            ->line("A timesheet for {$this->timesheet->assignment->reference_number} is waiting for your approval, please review and take action if needed.")
            ->line(
                new HtmlString(
                    view(
                        'timesheets.summary', [
                            'timesheet' => $this->timesheet
                        ]
                    )
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
