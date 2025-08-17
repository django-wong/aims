<?php

namespace Database\Seeders;

use App\Models\AssignmentType;
use App\Models\Budget;
use App\Models\PurchaseOrder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class BudgetSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $assignment_types = AssignmentType::all();
        $purchase_orders = PurchaseOrder::all();
        foreach ($assignment_types as $assignment_type) {
            foreach ($purchase_orders as $purchase_order) {
                Budget::factory()
                    ->for($assignment_type, 'assignment_type')
                    ->for($purchase_order, 'purchase_order')
                    ->create();
            }
        }
    }
}
