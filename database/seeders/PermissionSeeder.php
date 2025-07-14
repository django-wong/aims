<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PermissionSeeder extends Seeder
{
    public array $permissions = [
        ['audit_logs/view', 'View audit log of all activities; Critical information may included in the log, use with caution'],
        ['settings/edit', 'Manage agency settings like logo, name, contact info, and announcement'],

        ['clients/edit', 'Manage external users (client only so far)'],
        ['clients/view', 'View external users'],

        ['users/edit', 'Manage internal users of the agency (non-client)'],
        ['users/view', 'View internal users of the agency'],

        ['projects/view', 'View projects created by any one'],
        ['projects/view/owned', 'View projects created by any one'],
        ['projects/add', 'View projects created by any one'],
        ['projects/edit', 'Mange projects, also grant users/view permission implicitly'],
        ['projects/schedule', 'Schedule (part of edit) projects to users, also grant users/view permission implicitly'],
        ['projects/view/unassigned', 'View all unassigned projects would allow staff to claim a project'],

        ['project/invoice', 'Allow staff to access the invoice'],

        ['template/edit', 'Manage template for invoice, quote, and document'],
        ['invoice/create']
    ];
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
    }
}
