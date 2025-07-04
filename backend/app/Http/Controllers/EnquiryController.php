<?php
namespace App\Http\Controllers;

use App\Models\Enquiry;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Carbon\Carbon;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Log;


class EnquiryController extends Controller
{
    // Get all enquiries
    public function index()
    {
        return response()->json(Enquiry::all());
    }

    // Get total count of enquiries
    public function getTotalCount()
    {
        $totalCount = Enquiry::count();
        return response()->json(['total_count' => $totalCount]);
    }




//     public function getTodayEnquiries()
// {
//     $today = Carbon::today(); // Get today's date

//     // Fetch only enquiries created today
//     $todayEnquiries = Enquiry::whereDate('created_at', $today)->get();

//     return response()->json([
//         'today_enquiries' => $todayEnquiries->count(),
//         'enquiries' => $todayEnquiries
//     ]);
// }

public function getTodayEnquiries() 
{
    $customer = JWTAuth::parseToken()->authenticate(); // Authenticate user
    Log::info('Authenticated Customer:', ['customer' => $customer]);

    $today = Carbon::today(); // Get today's date

    // Fetch enquiries created today by the authenticated user
    $todayEnquiries = Enquiry::where('created_by', $customer->id)
        ->whereDate('created_at', $today)
        ->get();

    return response()->json([
        'today_enquiries' => $todayEnquiries->count(),
        'enquiries' => $todayEnquiries
    ]);
}


    // Create a new enquiry
//     public function store(Request $request)
//     {
        
// $customer = JWTAuth::parseToken()->authenticate();
// Log::info('Authenticated Customer:', ['customer' => $customer]);



//         $request->validate([
//             'name' => 'required|string|max:255',
//             'description' => 'nullable|string',
//             'source' => 'required|string',
//             'date' => 'required|date',
//             'phone' => 'nullable|string|max:15',
//             'email' => 'nullable|email|max:255',
//         ]);

//         $enquiry = Enquiry::create($request->all());

//         return response()->json($enquiry, 201);
//     }

public function store(Request $request)
{
    $customer = JWTAuth::parseToken()->authenticate();
    Log::info('Authenticated Customer:', ['customer' => $customer]);

    $request->validate([
        'name' => 'required|string|max:255',
        'description' => 'nullable|string',
        'source' => 'required|string',
        'date' => 'required|date',
        'phone' => 'nullable|string|max:15',
        'email' => 'nullable|email|max:255',
    ]);

    // Merge created_by into request data
    $enquiry = Enquiry::create(array_merge(
        $request->all(),
        ['created_by' => $customer->id]
    ));

    return response()->json($enquiry, 201);
}

    // Get a single enquiry
    public function show(Enquiry $enquiry)
    {
        return response()->json($enquiry);
    }

    // Update an enquiry
    public function update(Request $request, Enquiry $enquiry)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'source' => 'required|string',
            'date' => 'required|date',
            'phone' => 'nullable|string|max:15',
            'email' => 'nullable|email|max:255',
        ]);

        $enquiry->update($request->all());

        return response()->json($enquiry);
    }

    // Delete an enquiry
    public function destroy(Enquiry $enquiry)
    {
        $enquiry->delete();
        return response()->json(['message' => 'Enquiry deleted successfully']);
    }



    public function sendSmsEnquery(Request $request)
    {
        // Fetch customers
        $enquery = Enquiry::all();

        // SMS API Credentials
        $apiUrl = "https://sms.bluwaves.in/sendsms/bulk.php";
        $username = "ILCsoltechsolut";
        $password = "12345678";
        $sender = "STECHM";
        $entityId = "1701167282210491092";
        $templateId = "1707170488002410372";

        // Message template (example)
        $message = "Wishing you both a very Happy Marriage Anniversary!! May all your days be filled Love ,Joy and Happiness From Soltech Solution";

        // Collect all customer phone numbers in a comma-separated string
        $phoneNumbers = $enquery->pluck('phone')->implode(',');


        // Send the bulk SMS request
        $response = Http::get($apiUrl, [
            'username' => $username,
            'password' => $password,
            'type' => 'TEXT',
            'sender' => $sender,
            'mobile' => $phoneNumbers,
            'message' => $message,
            'entityId' => $entityId,
            'templateId' => $templateId
        ]);
        // dd($response);
        // Return the response (for debugging)
        return response()->json(['response' => $response->body()]);
    }


}
