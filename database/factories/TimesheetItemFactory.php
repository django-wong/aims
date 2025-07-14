<?php

namespace Database\Factories;

use App\Models\Timesheet;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\TimesheetItem>
 */
class TimesheetItemFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'timesheet_id' => Timesheet::factory(),
            'item_number' => $this->faker->unique()->numerify('ITEM-###'),
            'date' => $this->faker->date(),
            'week_number' => $this->faker->numberBetween(1, 53),
            'country' => $this->faker->country(),
            'hours' => $this->faker->numberBetween(-8, 8),
            'km_traveled' => $this->faker->numberBetween(-100, 100),
        ];
    }
}
