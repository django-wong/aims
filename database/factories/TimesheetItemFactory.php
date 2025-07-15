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
            'item_number' => $this->faker->unique()->numerify('ITEM-###'),
            'date' => $this->faker->date(),
            'week_number' => $this->faker->numberBetween(1, 53),
            'work_hours' => $this->faker->numberBetween(-8, 8),
            'days' => $this->faker->numberBetween(0, 7),
            'overnights' => $this->faker->numberBetween(0, 3),
            'travel_hours' => $this->faker->numberBetween(0, 4),
            'report_hours' => $this->faker->numberBetween(0, 2),
            'km_traveled' => $this->faker->numberBetween(-100, 100),
        ];
    }
}
