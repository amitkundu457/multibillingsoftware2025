<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleAndPermissionController extends Controller
{
    public function permission()
    {
        return Permission::all();
    }

    public function index()
    {
        $roles = Role::with('permissions')->get();
        return response()->json($roles);
    }


    public function show($id)
    {
        // Fetch the role by its ID with its associated permissions
        $role = Role::with('permissions')->findOrFail($id);

        // Return the role data along with permissions
        return response()->json($role);
    }



    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|unique:roles|max:255',
            'permissions' => 'array',
        ]);

        $role = Role::create(['name' => $validated['name']]);

        if (!empty($validated['permissions'])) {
            $permissions = Permission::whereIn('name', $validated['permissions'])->get();
            $role->permissions()->attach($permissions);
        }

        return response()->json(['message' => 'Role created successfully!', 'role' => $role]);
    }


    public function update(Request $request, $id)
    {
        $role = Role::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|unique:roles,name,' . $role->id,
            'permissions' => 'array',
        ]);

        $role->update(['name' => $validated['name']]);
        if (isset($validated['permissions'])) {
            $permissions = Permission::whereIn('name', $validated['permissions'])->get();
            $role->permissions()->sync($permissions);
        }

        return response()->json(['message' => 'Role updated successfully']);
    }

    public function destroy($id)
    {
        $role = Role::findOrFail($id);
        $role->delete();

        return response()->json(['message' => 'Role deleted successfully']);
    }
}
