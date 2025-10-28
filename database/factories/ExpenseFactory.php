<?php

namespace Database\Factories;

use App\Models\TimesheetItem;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Expense>
 */
class ExpenseFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'assignment_id' => null,
            'timesheet_id' => null,
            'timesheet_item_id' => null,
            'user_id' => null,
            'assignment_inspector_id' => null,

            'net_amount' => $this->faker->randomFloat(2, 10, 500),
            'process_fee' => $this->faker->randomFloat(2, 0, 20),
            'gst' => function (array $attributes) {
                return $attributes['net_amount'] * 0.1;
            },

            'type' => $this->faker->randomElement(['travel', 'meals', 'accommodation', 'other']),
            'invoice_number' => $this->faker->optional()->bothify('INV-####'),
            'creditor' => $this->faker->optional()->company(),
            'description' => $this->faker->optional()->sentence(),
            'report_number' => $this->faker->optional()->bothify('RPT-####'),
        ];
    }

    public function forTimesheetItem(TimesheetItem $item)
    {
        return $this->state(function (array $attributes) use ($item) {
            return [
                'assignment_id' => $item->timesheet->assignment_id,
                'timesheet_id' => $item->timesheet_id,
                'timesheet_item_id' => $item->id,
                'user_id' => $item->user_id,
                'assignment_inspector_id' => $item->timesheet->assignment_inspector_id,
            ];
        });
    }
}
