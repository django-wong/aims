<?php

namespace Database\Factories;

use App\Models\Client;
use App\Models\Org;
use App\Models\Project;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Assignment>
 */
class AssignmentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'assignment_type_id' => null,
            'client_id' => Client::factory(),
            'project_id' => Project::factory(),
            'org_id' => Org::factory(),
        ];
    }
}
