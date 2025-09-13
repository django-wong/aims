<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class Init extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:init';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->call('db:wipe', ['--force' => true]);
        $this->call('migrate', ['--force' => true]);
        $this->call('db:seed', ['--force' => true]);
        $this->info('Application initialized successfully.');
    }
}
