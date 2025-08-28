<?php

namespace Database\Factories;

use App\Models\AssignmentType;
use App\Models\Client;
use App\Models\Org;
use App\Models\Project;
use App\Models\PurchaseOrder;
use App\Models\User;
use App\Models\Vendor;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Assignment>
 */
class AssignmentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'assignment_type_id' => AssignmentType::factory(),
            'project_id' => Project::factory(),
            'org_id' => Org::factory(),
            'operation_org_id' => null,
            'operation_coordinator_id' => null,
            'purchase_order_id' => PurchaseOrder::factory(),
            'vendor_id' => Vendor::factory(),
            'sub_vendor_id' => Vendor::factory(),
            'report_required' => $this->faker->boolean(),
            'notes' => $this->faker->paragraph(),
        ];
    }

    public function of(Project $project)
    {
        return $this->recycle($project)->recycle($project->org);
    }
}
