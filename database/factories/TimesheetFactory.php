<?php

namespace Database\Factories;

use App\Models\Assignment;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Timesheet>
 */
class TimesheetFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $seed = Carbon::make($this->faker->dateTimeBetween('-1 month', 'now'));
        $start = $seed->startOfWeek()->format('Y-m-d');
        $end = $seed->endOfWeek()->format('Y-m-d');

        return [
            'assignment_id' => Assignment::factory(),
            'start' => $start,
            'end' => $end,
        ];
    }
}
