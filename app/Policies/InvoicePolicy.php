<?php

namespace App\Policies;

use App\Models\Client;
use App\Models\Invoice;
use App\Models\User;
use App\Models\UserRole;
use phpDocumentor\Reflection\Types\Boolean;

class InvoicePolicy
{
    public function viewAny(User $user):bool
    {
        return in_array($user->user_role->role, [
            UserRole::PM,
            UserRole::ADMIN,
            UserRole::FINANCE,
            UserRole::CLIENT,
        ]);
    }

    public function create(User $user):bool
    {
        return in_array($user->user_role->role, [
            UserRole::PM,
            UserRole::ADMIN,
            UserRole::FINANCE,
            UserRole::STAFF,
            UserRole::SYSTEM
        ]);
    }

    public function view(User $user, Invoice $invoice):bool
    {
        if ($user->isRole(UserRole::CLIENT)) {
            if ($invoice->invoiceable_type === Client::class) {
                return $invoice->invoiceable_id === $user->client?->id;
            }
        } else {
            return in_array($user->user_role->role, [
                UserRole::PM,
                UserRole::ADMIN,
                UserRole::FINANCE,
                UserRole::STAFF
            ]) && ($user->user_role->org_id == $invoice->invoiceable_id || $invoice->org_id == $user->user_role->org_id);
        }

        return false;
    }

    public function approve(User $user, Invoice $invoice): bool
    {
        if ($invoice->invoiceable_type === Client::class) {
            return $invoice->invoiceable_id === $user->client?->id;
        }

        return in_array($user->user_role->role, [
            UserRole::PM,
            UserRole::ADMIN,
            UserRole::FINANCE,
            UserRole::STAFF
        ]) && $user->user_role->org_id == $invoice->invoiceable_id;
    }

    public function reject(User $user, Invoice $invoice): bool
    {
        return $this->approve($user, $invoice);
    }

    public function update(User $user, Invoice $invoice)
    {
        return in_array($user->user_role->role, [
            UserRole::PM,
            UserRole::ADMIN,
            UserRole::FINANCE,
            UserRole::STAFF
        ]) && $user->user_role->org_id == $invoice->org_id;
    }

    public function destroy(User $user, Invoice $invoice): bool
    {
        return in_array($user->user_role->role, [
            UserRole::PM,
            UserRole::ADMIN,
            UserRole::FINANCE,
            UserRole::STAFF
        ]) && $user->user_role->org_id == $invoice->org_id;
    }
}
