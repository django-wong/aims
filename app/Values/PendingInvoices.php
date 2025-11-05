<?php

namespace App\Values;

use App\Models\Invoice;
use App\Models\UserRole;
use Illuminate\Database\Eloquent\Builder;

class PendingInvoices extends Value
{
    public function value(): int
    {
        return Invoice::query()->tap(function (Builder  $query) {
            $user = auth()->user();

            if (empty($user)) {
                return 0;
            }

            if ($user->isRole(UserRole::CLIENT)) {
                $query->whereMorphedTo('invoiceable', $user?->client);
            }

            if ($user->isAnyRole([
                UserRole::PM,
                UserRole::STAFF,
                UserRole::FINANCE,
                UserRole::ADMIN
            ])) {
                $query->whereMorphedTo('invoiceable', $user->user_role->org);
            }

        })->whereRaw('status > 0 and approved_at IS NULL')->count();
    }
}
