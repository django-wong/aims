<?php

namespace Database\Factories;

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
            'title' => $this->faker->sentence(3),
            'org_id' => 1, // Assuming org_id 1 exists
            'client_id' => 1, // Assuming client_id 1 exists
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
