<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Certificate>
 */
class CertificateFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'certificate_type_id' => null,
            'certificate_technique_id' => null,
            'certificate_level_id' => null,
            'title' => $this->faker->sentence(2),
            'issued_at' => $this->faker->dateTimeBetween('-3 years', '-1 month'),
            'expires_at' => $this->faker->optional(0.7)->dateTimeBetween('-1 month', '+2 months'),
        ];
    }
}
