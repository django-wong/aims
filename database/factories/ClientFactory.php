<?php

namespace Database\Factories;

use App\Models\Address;
use App\Models\Org;
use App\Models\User;
use App\Models\UserRole;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Client>
 */
class ClientFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'business_name' => $this->faker->company,
            'notes' => $this->faker->paragraph,
            'user_id' => User::factory(),
            'org_id' => Org::factory(),
            'address_id' => Address::factory(),
            'coordinator_id' => User::factory()->has(
                UserRole::factory()->state([
                    'role' => UserRole::STAFF,
                    'org_id' => Org::factory(),
                ]),
                'user_role'
            ),
        ];
    }
}
