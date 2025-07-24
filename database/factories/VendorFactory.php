<?php

namespace Database\Factories;

use App\Models\Address;
use App\Models\Org;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Vendor>
 */
class VendorFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'org_id' => Org::factory(),
            'name' => $this->faker->unique()->company(),
            'business_name' => $this->faker->company(),
            'address_id' => Address::factory(),
            'notes' => $this->faker->paragraph(3),
        ];
    }
}
