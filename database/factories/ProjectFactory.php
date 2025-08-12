<?php

namespace Database\Factories;

use App\Models\Client;
use App\Models\Org;
use App\Models\ProjectType;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Project>
 */
class ProjectFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => $this->faker->sentence(3),
            'project_type_id' => ProjectType::factory(),
            'org_id' => Org::factory(),
            'number' => $this->faker->unique()->regexify('2025-[A-Z]{3}-0\d{3}'),
            'client_id' => Client::factory()
        ];
    }
}
