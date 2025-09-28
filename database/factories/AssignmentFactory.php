<?php

namespace Database\Factories;

use App\Models\AssignmentType;
use App\Models\Client;
use App\Models\Org;
use App\Models\Project;
use App\Models\PurchaseOrder;
use App\Models\Skill;
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
            'reference_number' => $this->faker->unique()->bothify('####-ABC-####'),
            'previous_reference_number' => $this->faker->optional()->bothify('####-ABC-####'),
            'project_id' => Project::factory(),
            'org_id' => Org::factory(),
            'operation_org_id' => null,
            'operation_coordinator_id' => null,
            'purchase_order_id' => PurchaseOrder::factory(),
            'vendor_id' => Vendor::factory(),
            'sub_vendor_id' => Vendor::factory(),
            'report_required' => $this->faker->boolean(),
            'notes' => $this->faker->paragraph(),

            'status' => $this->faker->numberBetween(0, 8),

            'skill_id' => Skill::query()->inRandomOrder()->first()?->id,
            'equipment' => $this->faker->optional()->sentence(),

            'client_po' => $this->faker->optional()->bothify('PO-#####'),
            'client_po_rev' => $this->faker->optional()->bothify('REV-#'),
            'po_delivery_date' => $this->faker->optional()->dateTimeBetween('-1 month', '+3 months')?->format('Y-m-d'),
            'close_date' => $this->faker->optional()->dateTimeBetween('+1 month', '+6 months')?->format('Y-m-d'),
            'final_invoice_date' => $this->faker->optional()->dateTimeBetween('+2 months', '+7 months')?->format('Y-m-d'),

            'first_visit_date' => $this->faker->optional()->dateTimeBetween('+1 week', '+1 month')?->format('Y-m-d'),
            'visit_frequency' => $this->faker->optional()->randomElement(['Weekly', 'Daily']),
            'total_visits' => $this->faker->optional()->numberBetween(1, 20),
            'hours_per_visit' => $this->faker->optional()->numberBetween(1, 8),
            'visit_contact_id' => null,

            'inter_office_instructions' => $this->faker->optional()->paragraph(),
            'inspector_instructions' => $this->faker->optional()->paragraph(),

            'pre_inspection_meeting' => $this->faker->boolean,
            'final_inspection' => $this->faker->boolean,
            'dimensional' => $this->faker->boolean,
            'sample_inspection' => $this->faker->boolean,
            'witness_of_tests' => $this->faker->boolean,
            'monitoring' => $this->faker->boolean,
            'packing' => $this->faker->boolean,
            'document_review' => $this->faker->boolean,
            'expediting' => $this->faker->boolean,
            'audit' => $this->faker->boolean,
            'exit_call' => $this->faker->boolean,
            'flash_report' => $this->faker->boolean,

            'reporting_format' => $this->faker->numberBetween(0,1),
            'reporting_frequency' => $this->faker->numberBetween(0,1),
            'send_report_to' => $this->faker->numberBetween(0,1),
            'timesheet_format' => $this->faker->numberBetween(0,1),
            'ncr_format' => $this->faker->numberBetween(0,1),
            'punch_list_format' => $this->faker->numberBetween(0,1),
            'irn_format' => $this->faker->numberBetween(0,1),
            'document_stamp' => $this->faker->numberBetween(0,1),
            'issue_irn_to_vendor' => $this->faker->numberBetween(0,1),
        ];
    }

    public function of(Project $project)
    {
        return $this->recycle($project)->recycle($project->org);
    }
}
