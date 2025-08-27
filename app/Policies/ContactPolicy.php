<?php

namespace App\Policies;

use App\Models\Contact;
use App\Models\User;
use Illuminate\Support\Facades\Gate;

class ContactPolicy {
    public function update(User $user, Contact $contact): bool
    {
        return $user->can('update', $contact->contactable);
    }

    public function delete(User $user, Contact $contact): bool
    {
        return $this->update($user, $contact);
    }
}
