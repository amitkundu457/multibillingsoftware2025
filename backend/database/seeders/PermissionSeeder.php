<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        $permissions = [
            'create distributer',
            'edit distributer',
            'delete distributer',
            'view distributer',
            'create salesperson',
            'edit salesperson',
            'delete salesperson',
            'view salesperson',
            'create customers',
            'edit customers',
            'delete customers',
            'view customers',
        ];

        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission]);
        }
    }
}
