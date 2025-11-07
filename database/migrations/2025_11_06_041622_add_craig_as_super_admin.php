<?php

use App\Models\Org;
use App\Models\User;
use App\Models\UserRole;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $email = 'craig.davies@syndonex.com';

        if (User::query()->where('email', $email)->exists()) {
            return;
        }

        $user = User::query()->create([
            'first_name' => 'Craig',
            'last_name' => 'Davies',
            'title' => 'Mr',
            'email' => $email,
            'email_verified_at' => \Illuminate\Support\Carbon::now(),
            'password' => 'YunvDa391!',
        ]);

        $user->user_role()->create([
            'role' => UserRole::ADMIN,
            'org_id' => Org::query()->orderBy('id')->first()->id
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        User::query()->where('email', 'craig.davies@syndonex.com')->delete();
    }
};
