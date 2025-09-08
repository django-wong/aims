<?php

namespace App\Notifications;

use App\Models\Assignment;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\URL;

class AssignmentHasBeenIssued extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(public Assignment $assignment)
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
        $link = URL::signedRoute(
            'magic-link', [
                'redirect_to' => route('assignments.record', $this->assignment->id),
                'user' => $notifiable->id,
            ]
        );

        $data = [
            'assignment' => $this->assignment,
            'assignment_inspector' => $this->assignment->assignment_inspectors()->where('user_id', $notifiable->id)->with('assignment_type')->first(),
        ];

        $pdf = Pdf::loadView('pdfs.assignment-form', $data);

        $tmpFilePath = tempnam(sys_get_temp_dir(), $this->assignment->reference_number ?? $this->assignment->id) . '.pdf';
        $pdf->save($tmpFilePath);

        return (new MailMessage)
            ->view('email')
            ->subject('You have a new assignment ' . $this->assignment->reference_number)
            ->greeting('Hello ' . $notifiable->name)
            ->line('A new assignment has been issued to you.')
            ->line('Please review the assignment details and submit your timesheet once completed.')
            ->attachMany($this->assignment->attachments)
            ->attach(
                $tmpFilePath,
                [
                    'as' => 'Assignment-' . ($this->assignment->reference_number ?? $this->assignment->id) . '.pdf',
                    'mime' => 'application/pdf',
                ]
            )
            ->action(
                'View Assignment', $link
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
