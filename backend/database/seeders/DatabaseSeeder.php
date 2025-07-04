<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        // User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'admin@admin.com',
        //     'password'=>bcrypt('12345678')
        // ]);
        // Role::create(['name'=>'admin']);
        // Role::create(['name'=>'distributor']);
        \App\Models\User::findOrFail(1)->assignRole('admin');
        \App\Models\User::findOrFail(6)->assignRole('admin');
        \App\Models\User::findOrFail(11)->assignRole('distributor');
    }
}
