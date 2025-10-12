<?php

namespace Database\Factories;

use App\Models\Assignment;
use App\Models\Timesheet;
use App\Models\User;
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

        $status = $this->faker->randomElement([
            Timesheet::DRAFT,
            Timesheet::REVIEWING,
            Timesheet::APPROVED,
            Timesheet::CLIENT_APPROVED
        ]);

        $signed_off_at = $status >= Timesheet::REVIEWING ? $this->faker->dateTimeBetween($start, $end) : null;
        $approved_at = $status >= Timesheet::APPROVED ? $this->faker->dateTimeBetween($signed_off_at, $end) : null;
        $client_approved_at = $status >= Timesheet::CLIENT_APPROVED ? $this->faker->dateTimeBetween($approved_at, $end) : null;
        $client_reminder_sent_at = $status >= Timesheet::APPROVED && $this->faker->boolean ? $this->faker->dateTimeBetween($approved_at, $end) : null;
        return [
            'assignment_id' => Assignment::factory(),
            'user_id' => User::factory(),
            'start' => $start,
            'end' => $end,
            'status' => $status,
            'late' => $this->faker->boolean(60),
            'issue_code' => $this->faker->randomElement([0, 1, 2, 3, 4]),
            'signed_off_at' => $signed_off_at,
            'approved_at' => $approved_at,
            'client_approved_at' => $client_approved_at,
            'client_reminder_sent_at' => $client_reminder_sent_at,
        ];
    }
}
