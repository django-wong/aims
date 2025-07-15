<?php

namespace Database\Seeders;

use App\Models\CertificateType;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CertificateTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $types = [
            'AOC',
            'API 510',
            'ASNT',
            'AWS',
            'AWS CWI',
            'BTEC',
            'C.Eng',
            'City & Guilds',
            'CompEx',
            'CPWI',
            'CSWIP',
            'Degree - Batchelor',
            'Degree - Master',
            'Degree - PhD',
            'Driving Licence',
            'ExxonMobil',
            'Eyesight Test',
            'HNC',
            'HND',
            'ICorr',
            'Insurance - Car',
            'Insurance - PL',
            'NACE',
            'ONC',
            'OND',
            'Other',
            'Passport',
            'PCN'
        ];

        foreach ($types as $type) {
            CertificateType::query()->create(['name' => $type]);
        }
    }
}
