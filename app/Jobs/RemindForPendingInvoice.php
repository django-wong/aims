<?php

namespace App\Jobs;

use App\Models\Client;
use App\Models\Invoice;
use App\Notifications\InvoiceReminder;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Database\Query\JoinClause;
use Illuminate\Foundation\Queue\Queueable;

class RemindForPendingInvoice implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct()
    {
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $query = Invoice::query()->leftJoin('clients', function (JoinClause $query) {
            $query
                ->on('invoices.invoiceable_id', '=', 'clients.id')
                ->where('invoices.invoiceable_type', '=', Client::class);
        });

        $query->whereRaw(
            "status = ? and reminder_sent_at is null and sent_at >= date_sub(now(), interval 365 day) and DATEDIFF(now(), sent_at) >= ifnull(clients.invoice_reminder, 7)", [Invoice::SENT]
        );

        $query->select('invoices.*');

        while ($invoice = $query->clone()->first()) {
            $invoice->update([
                'reminder_sent_at' => now(),
            ]);
            $invoice->notifiable?->notify(new InvoiceReminder($invoice));
        }
    }
}
