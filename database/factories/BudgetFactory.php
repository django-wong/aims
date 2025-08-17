<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Budget>
 */
class BudgetFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'assignment_type_id' => \App\Models\AssignmentType::factory(),
            'purchase_order_id' => \App\Models\PurchaseOrder::factory(),
            'rate_code' => $this->faker->word,
            'hourly_rate' => $this->faker->randomFloat(2, 50, 200),
            'budgeted_hours' => $this->faker->randomFloat(2, 10, 100),
            'travel_rate' => $this->faker->randomFloat(2, 0.1, 1.0),
            'budgeted_mileage' => $this->faker->randomFloat(2, 0, 500),
        ];
    }
}
