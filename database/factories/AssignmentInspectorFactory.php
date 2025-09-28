<?php

namespace Database\Factories;

use App\Models\Assignment;
use App\Models\AssignmentType;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\AssignmentInspector>
 */
class AssignmentInspectorFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'assignment_id' => Assignment::factory(),
            'user_id' => User::factory(),
            'assignment_type_id' => AssignmentType::factory(),
            'acked_at' => $this->faker->optional()->dateTimeBetween('-1 month', 'now'),
            'signature_base64' => null,
            'hourly_rate' => $this->faker->randomFloat(2, 20, 100),
            'travel_rate' => $this->faker->randomFloat(2, 1, 5)
        ];
    }
}
