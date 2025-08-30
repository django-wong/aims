<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CertificateLevelSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $levels = [
            '-',
            '1 / I',
            '2 / II',
            '3 / III',
            '3.0 (Level 1)',
            '3.1 (Level 2)',
            '3.2 (Level 3)',
            'Approval',
            'EX F (Foundation)',
            'EX01',
            'EX02',
            'EX03',
            'EX04',
            'Welding QC Coordinator',
        ];

        foreach ($levels as $level) {
            \App\Models\CertificateLevel::query()->create(['name' => $level]);
        }
    }
}
