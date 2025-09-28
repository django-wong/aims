<?php

namespace Database\Seeders;

use App\Models\Assignment;
use App\Models\AssignmentInspector;
use App\Models\Budget;
use App\Models\User;
use App\Models\UserRole;
use Database\Factories\AssignmentInspectorFactory;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AssignmentInspectorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::query()->whereHas('user_role', function ($query) {
            $query->where('role', UserRole::INSPECTOR);
        })->get();

        $data = Assignment::query()
            ->leftJoin('purchase_orders', 'assignments.purchase_order_id', '=', 'purchase_orders.id')
            ->leftJoin('budgets', 'purchase_orders.id', '=', 'budgets.purchase_order_id')
            ->select([
                'assignments.*',
                'budgets.assignment_type_id as assignment_type_id'
            ])
            ->cursor();

        foreach ($data as $assignment) {
            AssignmentInspector::factory()
                ->recycle($users)
                ->state([
                    'assignment_type_id' => $assignment->assignment_type_id,
                    'assignment_id' => $assignment->id
                ])
                ->create();
        }
    }
}
