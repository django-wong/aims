<?php

namespace Database\Factories;

use App\Models\Client;
use App\Models\Org;
use App\Models\Project;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\PurchaseOrder>
 */
class PurchaseOrderFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => $this->faker->bothify('PO-#####'),
            'org_id' => Org::factory(),
            'project_id' => Project::factory(),
            'quote_id' => null, // Assuming no quote is linked
            'budget' => $this->faker->randomFloat(2, 1000, 10000),
            'first_alert_threshold' => $this->faker->numberBetween(50, 80),
            'second_alert_threshold' => $this->faker->numberBetween(80, 95),
            'final_alert_threshold' => $this->faker->numberBetween(95, 100),
            'first_alert_at' => null,
            'second_alert_at' => null,
            'final_alert_at' => null,
        ];
    }
}
