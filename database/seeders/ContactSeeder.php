<?php

namespace Database\Seeders;

use App\Models\Client;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ContactSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Client::query()->cursor()->each(function (Client $client) {
            $client->contacts()->createMany(
                \App\Models\Contact::factory(5)->make()->toArray()
            );
        });
    }
}
