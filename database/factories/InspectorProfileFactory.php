<?php

namespace Database\Factories;

use App\Models\Address;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\InspectorProfile>
 */
class InspectorProfileFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'address_id' => Address::factory(),
            'user_id' => User::factory(),
            'hourly_rate' => $this->faker->randomFloat(2, 20, 100),
            'initials' => $this->faker->word,
            'travel_rate' => $this->faker->randomFloat(2, 10, 30),
            'assigned_identifier' => $this->faker->unique()->bothify('ID###'),
            'include_on_skills_matrix' => $this->faker->boolean(),
            'notes' => $this->faker->paragraph(),
        ];
    }
}
