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
            'po_number' => $this->faker->unique()->numerify('PO-#####'),
            'number' => $this->faker->unique()->regexify('2025-[A-Z]{3}-0\d{3}'),
            'budget' => $this->faker->randomFloat(2, 1000, 100000),
            'quote_id' => null, // Assuming quotes are handled separately
            'status' => $this->faker->randomElement([0, 1, 2]), // 0: Draft, 1: Open, 2: Closed
            'client_id' => Client::factory()
        ];
    }
}
