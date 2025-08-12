<?php

namespace Database\Factories;

use App\Models\Address;
use App\Models\Org;
use App\Models\User;
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
        ];
    }
}
