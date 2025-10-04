<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Hash;

use Illuminate\Validation\ValidationException;

class PasswordResetLinkController extends Controller
{
    public function resetPassword(Request $request)
    {
        // Validate incoming request data
        $request->validate([
            'email' => 'required|email|exists:users,email',  // Ensure email exists in the database
            'new_password' => 'required|min:6',  // Password should be at least 6 characters
            'confirm_password' => 'required|same:new_password',  // Ensure passwords match
        ]);

        // Get the user by email
        $user = User::where('email', $request->email)->first();

        if ($user) {
            // Update the user's password with the new hashed password
            $user->password = Hash::make($request->new_password);
            $user->save();

            // Return a success response
            return response()->json(['message' => 'Password successfully updated.'], 200);
        }

        // If user not found
        return response()->json(['error' => 'User not found.'], 404);
    }
}
