<?php

namespace App\Http\Controllers\Api;

use Carbon\Carbon;
use App\Models\Otp;
use App\Models\User;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Models\UserInformation;
use Tymon\JWTAuth\Facades\JWTAuth;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Tymon\JWTAuth\Exceptions\JWTException;
use Illuminate\Support\Facades\Log;

class AuthController extends Controller
{
    // public function login(Request $request)
    // {
    //     $credentials = $request->only(['email', 'password']); // Ensure these fields match your database columns

    //     try {
    //         if (! $token = JWTAuth::attempt($credentials)) {
    //             return response()->json(['error' => 'Unauthorized'], 401); // Invalid credentials
    //         }
    //     } catch (JWTException $e) {
    //         return response()->json(['error' => 'Could not create token'], 500); // Token generation failure
    //     }

    //     return $this->respondWithToken($token);
    // }
    public function login(Request $request)
{
    $credentials = $request->only(['email', 'password']);

    try {
        // Attempt to find the user
        $user = User::where('email', $request->email)->first();
        // Log::info('user check',['user'=>$user]);
        // Log::info('Authenticated Customer:', ['customer' => $customer]);
        // Check if the user exists and their status
        if (!$user || $user->status != 1) {
            return response()->json(['error' => 'Access denied. Your account is not approved.'], 403);
        }

        // Authenticate user and generate JWT token
        if (! $token = JWTAuth::attempt($credentials)) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        // Update last_login_at timestamp
        $user->update(['last_login_at' => Carbon::now()]);

    } catch (JWTException $e) {
        return response()->json(['error' => 'Could not create token'], 500);
    }

    return $this->respondWithToken($token);
}

    /**
     * Get the authenticated User.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function me()
    {
        $user = JWTAuth::user();
        //$user->load('roles')->getAllPermissions();
        $user->load('roles', 'permissions', 'information');
// dd( $user);
       // return response()->json($user);
        return response()->json([
            'user' => $user,
            'roles' => $user->roles,
            'permissions' => $user->getAllPermissions(),
            'user_information' => $user->information, // Fetching user info
        ], 200);
    }

    /**
     * Log the user out (Invalidate the token).
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout()
    {
        JWTAuth::logout();

        return response()->json(['message' => 'Successfully logged out']);
    }

    /**
     * Refresh a token.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function refresh()
    {
        return $this->respondWithToken(JWTAuth::refresh());
    }

    /**
     * Get the token array structure.
     *
     * @param  string $token
     *
     * @return \Illuminate\Http\JsonResponse
     */
    protected function respondWithToken($token)
    {
        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => JWTAuth::factory()->getTTL(),
        ]);
    }

    public function Register(Request $request)
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:' . User::class],
            // 'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->string('password')),
        ]);
        return $user;
    }




public function sendOtp(Request $request)
{
    $request->validate([
        'phone' => 'required|digits:10' // Ensure phone number format
    ]);

    $phone = $request->phone;
    $otp = rand(100000, 999999); // Generate a 6-digit OTP

    // Store OTP in the database (either update or create a new entry)
    Otp::updateOrCreate(
        ['phone' => $phone], // Search for existing phone
        ['otp' => $otp, 'expires_at' => now()->addMinutes(5)] // Expiry in 5 minutes
    );

    // Send OTP via Bluwaves SMS API
    $apiUrl = "https://sms.bluwaves.in/sendsms/bulk.php";
    $username = "ILCsoltechsolut";
    $password = "12345678";
    $sender = "STECHM";
    $entityId = "1701167282210491092";
    $templateId = "1707170212284945996";

    // Replace `{#var#}` with the actual OTP
    $message = "OTP for Login in Soltech Solution Crm $otp. OTP is confidential. Please enter it yourself and do not disclose to anyone.";

    $response = Http::get($apiUrl, [
        'username' => $username,
        'password' => $password,
        'type' => 'TEXT',
        'sender' => $sender,
        'mobile' => $phone,
        'message' => $message,
        'entityId' => $entityId,
        'templateId' => $templateId
    ]);

    if ($response->successful()) {
        return response()->json(['message' => 'OTP sent successfully']);
    } else {
        return response()->json(['error' => 'Failed to send OTP'], 500);
    }
}



public function verifyOtp(Request $request)
{


    $phone = $request->phone;
    $otp = $request->otp;

    // Check if phone number exists in user_informations table
    $userInformation = UserInformation::where('mobile_number', $phone)->first();


    if (!$userInformation) {
        return response()->json(['error' => 'Phone number not registered'], 404);
    }

    // Retrieve the user using the relationship
    $user = $userInformation->users;
    // dd($user);

    if (!$user) {
        return response()->json(['error' => 'User not found'], 404);
    }

    // Check if OTP exists and is valid
    $otpEntry = Otp::where('phone', $phone)
        ->where('otp', $otp)
        ->where('expires_at', '>', now()) // Ensure OTP is not expired
        ->first();

    if (!$otpEntry) {
        return response()->json(['error' => 'Invalid or expired OTP'], 401);
    }

    // Generate JWT token for authentication
    $token = JWTAuth::fromUser($user);

    // Delete OTP after successful login
    $otpEntry->delete();

    return response()->json([
        'token' => $token,
        'user' => $user
    ]);
}

public function updateStatus(Request $request)
    {
        // $request->validate([
        //     'id' => 'required|exists:users,id',
        //     'status' => 'required|in:approved,rejected',
        // ]);

        $user = User::find($request->id);
        $user->status = $request->status;
        $user->save();

        return response()->json(['message' => 'Status updated successfully', 'status' => $user->status]);
    }


    public function getLastLoginCustomers(Request $request)
    {
        $query = User::whereNotNull('last_login_at')
                     ->where('id', '!=', 1); // Exclude user with ID 1

        // Apply date range filter if both start_date and end_date are provided
        if ($request->has('start_date') && $request->has('end_date')) {
            $query->whereBetween('last_login_at', [$request->start_date, $request->end_date]);
        }

        $customers = $query->orderBy('last_login_at', 'desc')
                           ->get(['id', 'name', 'email', 'last_login_at']);

        return response()->json($customers);
    }



    public function getLastVisitCustomers(Request $request)
    {
        $tenDaysAgo = now()->subDays(10)->toDateString(); // Get date 10 days ago

        $query = User::join('customers', 'customers.user_id', '=', 'users.id')
            ->select(
                'users.id',
                'users.name',
                'users.email',
                'customers.phone',
                'customers.address',
                'customers.state',
                'customers.country',
                'customers.last_order_at',
                \DB::raw('DATEDIFF(NOW(), customers.last_order_at) as days_since_last_order') // Calculate days since last order
            )
            ->whereNotNull('customers.last_order_at')
            ->where('customers.last_order_at', '<', $tenDaysAgo); // Only include customers with last order before 10 days

        // Exclude user with ID 1
        if ($request->has('exclude_id') && $request->exclude_id == 1) {
            $query->where('users.id', '!=', 1);
        }

        // Apply date range filter if both start_date and end_date are provided
        if ($request->has('start_date') && $request->has('end_date')) {
            $query->whereBetween('customers.last_order_at', [$request->start_date, $request->end_date]);
        }

        $customers = $query->orderBy('customers.last_order_at', 'desc')->get();

        return response()->json($customers);
    }




}
