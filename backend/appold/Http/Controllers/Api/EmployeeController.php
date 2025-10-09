<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Log;


class EmployeeController extends Controller
{
    // Fetch and display all employees as JSON
//     public function index()
//     {
        
// $customer = JWTAuth::parseToken()->authenticate();
// Log::info('Authenticated Customer:', ['customer' => $customer]);



//         $employees = User::whereHas('employees')->with('employees')->get();
//         return response()->json(['employees' => $employees], 200);
//     }
public function index()
{
    // Authenticate the customer from the JWT token
    $customer = JWTAuth::parseToken()->authenticate();
    Log::info('Authenticated Customer:', ['customer' => $customer]);

    // Get users who have employees created by this customer
    $employees = User::whereHas('employees', function ($query) use ($customer) {
        $query->where('created_by', $customer->id);
    })
    ->with(['employees' => function ($query) use ($customer) {
        $query->where('created_by', $customer->id);
    }])
    ->get();

    return response()->json(['employees' => $employees], 200);
}



    // Store a new employee from JSON request
    // public function store(Request $request)
    // {
    //     $customer = JWTAuth::parseToken()->authenticate();

    //     // Validate the request input (no required fields)
    //     // $validator = Validator::make($request->all(), [
    //     //     'name' => 'string|max:255',
    //     //     'email' => 'email|unique:users,email',
    //     //     'password' => 'string|min:6',
    //     //     'phone' => 'string|max:15',
    //     //     'address' => 'string|max:255',
    //     //     'joining_date' => 'date',
    //     //     'dob' => 'date',
    //     //     'gender' => 'string',
    //     // ]);

    //     // if ($validator->fails()) {
    //     //     return response()->json(['errors' => $validator->errors()], 422);
    //     // }

    //     // Create the user
    //     $user = User::create([
    //         'name' => $request->name,
    //         'email' => $request->email,
    //         'password' => $request->password ? bcrypt($request->password) : null,
    //     ]);

    //     // Create the employee and associate the user_id
    //     // $employee = Employee::create([
    //     //     'user_id' => $user->id,
    //     //     'phone' => $request->phone? ||"",
    //     //     'address' => $request->address,
    //     //     'joining_date' => $request->joining_date,
    //     //     'dob' => $request->dob,
    //     //     'gender' => $request->gender,
    //     //     'created_by' => $customer->id,
    //     // ]);

    //     $employee = Employee::create([
    //         'user_id' => $user->id,
    //         'phone' => $request->phone ?? "",
    //         'address' => $request->address ?? "",
    //         'joining_date' => $request->joining_date ?? "",
    //         'dob' => $request->dob ?? "",
    //         'gender' => $request->gender ?? "",
    //         'created_by' => $customer->id,
    //     ]);


    //     return response()->json([
    //         'message' => 'Employee created successfully!',
    //         'employee' => $employee,
    //         'user' => $user,
    //     ], 201);
    // }

    public function store(Request $request)
{
    // Authenticate the customer
    $customer = JWTAuth::parseToken()->authenticate();

    

    // Create the user
    $user = User::create([
        'name' => $request->name,
        'email' => $request->email,
        'password' => $request->password ? bcrypt($request->password) : null,
    ]);

    // Create the employee associated with the user and created_by customer
    $employee = Employee::create([
        'user_id' => $user->id,
        'phone' => $request->phone ?? '',
        'address' => $request->address ?? '',
        'joining_date' => $request->joining_date ?? null,
        'dob' => $request->dob ?? null,
        'gender' => $request->gender ?? '',
        'created_by' => $customer->id,
    ]);

    return response()->json([
        'message' => 'Employee created successfully!',
        'employee' => $employee,
        'user' => $user,
    ], 201);
}


    // Fetch a single employee as JSON
    public function show(Employee $employee)
    {
        return response()->json(['employee' => $employee], 200);
    }

    // Update an employee from JSON request
    // public function update(Request $request, $id)
    // {
    //     $user = User::find($id);
    //     if (!$user) {
    //         return response()->json(['message' => 'User not found!'], 404);
    //     }

    //     $employee = Employee::where('user_id', $user->id)->first();
    //     if (!$employee) {
    //         return response()->json(['message' => 'Employee not found!'], 404);
    //     }

    //     // Validate (no required fields)
    //     $validator = Validator::make($request->all(), [
    //         'name' => 'string|max:255',
    //         'email' => 'email|unique:users,email,' . $id,
    //         'phone' => 'string|max:15',
    //         'address' => 'string|max:255',
    //         'joining_date' => 'date',
    //         'dob' => 'date',
    //         'gender' => 'string',
    //     ]);

    //     if ($validator->fails()) {
    //         return response()->json(['errors' => $validator->errors()], 422);
    //     }

    //     $user->update([
    //         'name' => $request->name ?? $user->name,
    //         'email' => $request->email ?? $user->email,
    //     ]);

    //     $employee->update([
    //         'phone' => $request->phone ?? $employee->phone,
    //         'address' => $request->address ?? $employee->address,
    //         'joining_date' => $request->joining_date ?? $employee->joining_date,
    //         'dob' => $request->dob ?? $employee->dob,
    //         'gender' => $request->gender ?? $employee->gender,
    //     ]);

    //     return response()->json([
    //         'message' => 'Employee updated successfully!',
    //         'employee' => $employee,
    //         'user' => $user,
    //     ], 200);
    // }
//     public function update(Request $request, $id)
// {
//     $user = User::find($id);
//     if (!$user) {
//         return response()->json(['message' => 'User not found!'], 404);
//     }

//     $employee = Employee::where('user_id', $user->id)->first();
//     if (!$employee) {
//         return response()->json(['message' => 'Employee not found!'], 404);
//     }

//     // Force-cast values to strings if present
//     $request->merge([
//         'phone' => $request->has('phone') ? (string) $request->phone : null,
//         'address' => $request->has('address') ? (string) $request->address : null,
//     ]);

//     // Dynamic rules
//     $rules = [
//         'name' => 'string|max:255',
//         'phone' => 'string|max:15',
//         'address' => 'string|max:255',
//         'joining_date' => 'date',
//         'dob' => 'date',
//         'gender' => 'string',
//     ];

//     // Only validate email uniqueness if it's being changed
//     if ($request->has('email') && $request->email !== $user->email) {
//         $rules['email'] = 'email|unique:users,email';
//     } elseif ($request->has('email')) {
//         $rules['email'] = 'email'; // Just validate format, not uniqueness
//     }

//     $validator = Validator::make($request->all(), $rules);

//     if ($validator->fails()) {
//         return response()->json(['errors' => $validator->errors()], 422);
//     }

//     // Update user
//     $user->update($request->only(['name', 'email']));

//     // Update employee
//     $employee->update($request->only([
//         'phone',
//         'address',
//         'joining_date',
//         'dob',
//         'gender',
//     ]));

//     return response()->json([
//         'message' => 'Employee updated successfully!',
//         'employee' => $employee,
//         'user' => $user,
//     ], 200);
// }


// 

// public function update(Request $request, $id)
// {
//     $user = User::find($id);
//     if (!$user) {
//         return response()->json(['message' => 'User not found!'], 404);
//     }

//     $employee = Employee::where('user_id', $user->id)->first();
//     if (!$employee) {
//         return response()->json(['message' => 'Employee not found!'], 404);
//     }

    

//     // Update user if any fields are present
//     $userData = $request->only(['name', 'email','password']);
//     if (!empty($userData)) {
//         $user->update($userData);
//     }

//     // dd( $userData);
//     // Update employee if any fields are present
//     $employeeData = $request->only(['phone', 'address', 'joining_date', 'dob', 'gender']);

//     // Ensure data is in correct types
//     $employeeData['phone'] = (string)$employeeData['phone'];
//     $employeeData['address'] = (string)$employeeData['address'];
//     $employeeData['joining_date'] = $employeeData['joining_date'] ? $employeeData['joining_date'] : null;
//     $employeeData['dob'] = $employeeData['dob'] ? $employeeData['dob'] : null;
//     $employeeData['gender'] = (string)$employeeData['gender'];

//     if (!empty($employeeData)) {
//         $employee->update($employeeData);
//     }

//     return response()->json([
//         'message' => 'Employee updated successfully!',
//         'employee' => $employee,
//         'user' => $user,
//     ]);
// }

public function update(Request $request, $id)
{
    $user = User::find($id);
    if (!$user) {
        return response()->json(['message' => 'User not found!'], 404);
    }

    $employee = Employee::where('user_id', $user->id)->first();
    if (!$employee) {
        return response()->json(['message' => 'Employee not found!'], 404);
    }

    // Update user fields if provided
    $userData = $request->only(['name', 'email', 'password']);
    if (isset($userData['password'])) {
        $userData['password'] = bcrypt($userData['password']);
    }
    $user->update(array_filter($userData)); // avoid updating nulls

    // Update employee fields if provided
    $employeeData = [];

    if ($request->has('phone')) {
        $employeeData['phone'] = (string) $request->phone;
    }

    if ($request->has('address')) {
        $employeeData['address'] = (string) $request->address;
    }

    if ($request->has('joining_date')) {
        $employeeData['joining_date'] = $request->joining_date;
    }

    if ($request->has('dob')) {
        $employeeData['dob'] = $request->dob;
    }

    if ($request->has('gender')) {
        $employeeData['gender'] = (string) $request->gender;
    }

    if (!empty($employeeData)) {
        $employee->update($employeeData);
    }

    return response()->json([
        'message' => 'Employee updated successfully!',
        'employee' => $employee,
        'user' => $user,
    ]);
}



    // Automatically delete employee data when a user is deleted
    public function destroy($id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'User not found!'], 404);
        }

        $employee = Employee::where('user_id', $user->id)->first();
        if ($employee) {
            $employee->delete();
        }

        $user->delete();

        return response()->json(['message' => 'User and associated employee deleted successfully!'], 200);
    }
}
