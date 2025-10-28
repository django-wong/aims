<?php

namespace Database\Seeders;

use App\Models\Expense;
use App\Models\TimesheetItem;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ExpenseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        foreach (TimesheetItem::query()->inRandomOrder()->limit(1000)->cursor() as $item) {
            Expense::factory()->forTimesheetItem($item)->create();
        }
    }
}
