<?php

namespace Database\Seeders;

use App\Models\Certificate;
use App\Models\InspectorProfile;
use App\Models\User;
use Database\Factories\CertificateFactory;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CertificateSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Certificate::factory(100)
            ->recycle(
                User::query()->whereIn('id', InspectorProfile::query()->select('inspector_profiles.user_id'))->get()
            )
            ->create();
    }
}
