<?php

namespace Database\Factories;

use App\Models\Timesheet;
use App\Models\User;
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
            'user_id' => User::factory(),
            'item_number' => $this->faker->numerify('ITEM-###'),
            'date' => $this->faker->date(),
            'week_number' => $this->faker->numberBetween(1, 53),

            'hourly_rate' => $this->faker->randomFloat(2, 10, 100),
            'work_hours' => $this->faker->numberBetween(-8, 8),
            'travel_hours' => $this->faker->numberBetween(0, 4),
            'report_hours' => $this->faker->numberBetween(0, 2),

            'days' => $this->faker->numberBetween(0, 7),
            'overnights' => $this->faker->numberBetween(0, 3),

            'travel_distance' => $this->faker->optional()->numberBetween(0, 100) ?? 0,
            'travel_rate' => $this->faker->randomFloat(2, 1, 5),

            'pay_rate' => $this->faker->randomFloat(2, 10, 100),
            'pay_travel_rate' => $this->faker->randomFloat(2, 1, 5),
        ];
    }
}
