<?php

namespace Database\Factories;

use App\Models\Org;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\AssignmentType>
 */
class AssignmentTypeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'org_id' => Org::factory(),
            'name' => $this->faker->unique()->word(3)
        ];
    }
}
