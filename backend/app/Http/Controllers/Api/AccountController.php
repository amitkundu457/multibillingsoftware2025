<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Account;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Tymon\JWTAuth\Facades\JWTAuth;
class AccountController extends Controller
{
   // Display all accounts
   public function index()
   {
    $customer = JWTAuth::parseToken()->authenticate();
    $accounts = Account::where('created_by', $customer->id)
    ->with(['creditCustomer', 'debitCustomer'])
    ->get();

return response()->json($accounts);
       return response()->json($accounts);
   }

   // Create a new account


//    public function store(Request $request)
//    {
//        // Authenticate the user using JWT
//        $customer = JWTAuth::parseToken()->authenticate();

//        // Validate the request data
//        $validatedData = $request->validate([
//         'rcp_no' => 'required|string|unique:accounts,rcp_no',
//            'customer_id' => 'required',
//            'recive_id' => 'required',
//            'checkin_date' => 'required',
//         //  'account_type' => 'required',
//            'amount' => 'nullable|numeric',
//            'ref_no' => 'nullable|string|max:255',
//            'narration' => 'nullable|string|max:500',
//        ]);

//        // Get the current date (MMDD format)
//        $datePart = now()->format('md');

//        // Retrieve the latest ID and increment it
//        $lastId = DB::table('accounts')->max('id') ?? 0;
//        $newId = $lastId + 1;

//        // Generate the receipt number
//        $rcpNo = "RCP{$datePart}/{$newId}";

//        // Add the receipt number and created_by fields to the validated data
//        $validatedData['rcp_no'] = $rcpNo;
//        $validatedData['created_by'] = $customer->id;

//        // Create the account record
//        $account = Account::create($validatedData);

//        // Return the created account as a JSON response
//        return response()->json($account, 201);
//    }




public function store(Request $request)
{
    // Authenticate user
    $customer = JWTAuth::parseToken()->authenticate();

    // Validate input
    $validatedData = $request->validate([
        'credit_customer_id' => 'nullable',
        'debit_customer_id' => 'nullable',

        'recive_id' => 'nullable',
        'checkin_date' => 'required',
        'account_type' => 'required|string',
        'amount' => 'nullable|numeric',
        'ref_no' => 'nullable|string|max:255',
        'narration' => 'nullable|string|max:500',
    ]);



    // Define prefix based on transaction type
    $prefixes = [
        'receipt' => 'RCP',
        'contra' => 'CON',
        'journal' => 'JRN',
        'payment' => 'PAY',
    ];

    // Get the correct prefix for the given transaction type
    $transactionType = strtolower($request->account_type);
    $prefix = $prefixes[$transactionType] ?? 'TXN'; // Default to TXN if invalid

    // Get the last stored transaction number of the same type
    $lastTransaction = DB::table('accounts')
        ->where('rcp_no', 'LIKE', "{$prefix}%")
        ->orderBy('id', 'desc')
        ->first();

    // Extract and increment the last number
    if ($lastTransaction) {
        preg_match('/\d+$/', $lastTransaction->rcp_no, $matches);
        $lastNumber = isset($matches[0]) ? (int) $matches[0] : 0;
        $newNumber = $lastNumber + 1;
    } else {
        $newNumber = 1; // Start from 1 if no previous entry
    }

    // Format new transaction number (e.g., RCP0001, CON0002, JRN0003, PAY0004)
    $newTransactionNo = $prefix . str_pad($newNumber, 4, '0', STR_PAD_LEFT);

    // Add transaction number and created_by fields
    $validatedData['rcp_no'] = $newTransactionNo;
    $validatedData['created_by'] = $customer->id;

    // Store in database
    $account = Account::create($validatedData);

    return response()->json([
        'status' => 'success',
        'message' => 'Transaction created successfully',
        'transaction_no' => $newTransactionNo,
        'account' => $account
    ]);
}



public function getLastTransactionNumber($type)
{
    // Define transaction prefixes
    $prefixes = [
        'receipt' => 'RCP',
        'contra' => 'CON',
        'journal' => 'JRN',
        'payment' => 'PAY',
    ];

    // Get prefix
    $transactionType = strtolower($type);
    $prefix = $prefixes[$transactionType] ?? 'TXN';

    // Get last transaction
    $lastTransaction = DB::table('accounts')
        ->where('rcp_no', 'LIKE', "{$prefix}%")
        ->orderBy('id', 'desc')
        ->first();

    $lastNumber = $lastTransaction ? $lastTransaction->rcp_no : "{$prefix}0000";

    return response()->json(['transaction_no' => $lastNumber]);
}





   // Display a specific account
   public function show($id)
   {
       $account = Account::find($id);

       if (!$account) {
           return response()->json(['error' => 'Account not found'], 404);
       }

       return response()->json($account);
   }

   // Update an account
   public function update(Request $request, $id)
   {
       $account = Account::find($id);

       if (!$account) {
           return response()->json(['error' => 'Account not found'], 404);
       }

       $validatedData = $request->validate([
        //    'rcp_no' => 'required|string|max:255',
        //    'customer_id' => 'required',
        //    'recive_id' => 'required',
           'amount' => 'nullable|numeric',
           'ref_no' => 'nullable|string|max:255',
           'narration' => 'nullable|string|max:500',
        //    'created_by' => 'required|exists:users,id',
       ]);

       $account->update($validatedData);
       return response()->json($account);
   }

   // Delete an account
   public function destroy($id)
   {
       $account = Account::find($id);

       if (!$account) {
           return response()->json(['error' => 'Account not found'], 404);
       }

       $account->delete();
       return response()->json(['message' => 'Account deleted successfully']);
   }
}
