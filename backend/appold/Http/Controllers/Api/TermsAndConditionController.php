<?php

// namespace App\Http\Controllers\api;

// use App\Http\Controllers\Controller;
// use App\Models\Termscondition;
// use App\Models\Term;
// use Illuminate\Http\Request;

// class TermsAndConditionController extends Controller
// {


//     // Display a list of all records
//     public function index()
//     {
//         $termsconditions = Termscondition::all();
//         return response()->json($termsconditions);
//     }

//     // Store a new record in the database
//     public function store(Request $request)
//     {
//         $request->validate([
//             'name' => 'required|string|max:255',
//             'description' => 'required|string',
//         ]);

//         $termscondition = Termscondition::create($request->all());
//         return response()->json(['message' => 'Record created successfully!', 'data' => $termscondition], 201);
//     }

// //term&c for invoice 
// public function storeInvoice(Request $request){
//     $request->validate([
//         'content' => 'required|string'
//     ]);

//     $term = Term::create([
//         'content' => $request->content
//     ]);

//     return response()->json([
//         'message' => 'Terms created successfully',
//         'data' => $term
//     ], 201);
// }

// //update the ternm and condtion for invoice 
// public function updateTernsCondition( Request $request ,$id){
//     $request->validate([
//         'content' => 'required|string'
//     ]);

//     $term = Term::findOrFail($id);
//     $term->update([
//         'content' => $request->content
//     ]);

//     return response()->json([
//         'message' => 'Terms updated successfully',
//         'data' => $term
//     ]);
// }
// }

// public function getInvoicecondition(){
//     $terms = Term::latest()->get(); // You can also use ->first() if only one record is expected

//     return response()->json($terms);
// }
//     // Update an existing record
//     public function update(Request $request, $id)
//     {
//         $termscondition = Termscondition::find($id);

//         if (!$termscondition) {
//             return response()->json(['message' => 'Record not found!'], 404);
//         }

//         $request->validate([
//             'name' => 'required|string|max:255',
//             'description' => 'required|string',
//         ]);

//         $termscondition->update($request->all());
//         return response()->json(['message' => 'Record updated successfully!', 'data' => $termscondition]);
//     }

//     // Delete a record
//     public function destroy($id)
//     {
//         $termscondition = Termscondition::find($id);

//         if (!$termscondition) {
//             return response()->json(['message' => 'Record not found!'], 404);
//         }

//         $termscondition->delete();
//         return response()->json(['message' => 'Record deleted successfully!']);
//     }
// }







namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\Termscondition;
use App\Models\Term;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;

class TermsAndConditionController extends Controller
{
    // Display a list of all records
    public function index()
    {
        $termsconditions = Termscondition::all();
        return response()->json($termsconditions);
    }

    // Store a new record in the database
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
        ]);

        $termscondition = Termscondition::create($request->all());
        return response()->json(['message' => 'Record created successfully!', 'data' => $termscondition], 201);
    }

    // Term & Condition for invoice
    public function storeInvoice(Request $request)
    {
        $customer = JWTAuth::parseToken()->authenticate();

        $request->validate([
            'content' => 'required|string'
        ]);

        $term = Term::create([
            'content' => $request->content,
            'created_by'=>$customer->id
        ]);

        return response()->json([
            'message' => 'Terms created successfully',
            'data' => $term
        ], 201);
    }

    // Update the term and condition for invoice
    public function updateTernsCondition(Request $request, $id)
    {
        
        // $request->validate([
        //     'content' => 'required|string'
        // ]);

        // $term = Term::findOrFail($id);
        // $term->update([
        //     'content' => $request->content
        // ]);

        // return response()->json([
        //     'message' => 'Terms updated successfully',
        //     'data' => $term
        // ]);
        $request->validate([
            'content' => 'required|string'
        ]);
    
        // Try to find the term by ID
        $term = Term::find($id);
    
        if (!$term) {
            return response()->json(['message' => 'Term not found!'], 404);
        }
    
        $term->content = $request->content;
        $term->save();
    
        return response()->json([
            'message' => 'Terms updated successfully',
            'data' => $term
        ]);
    }

    // ✅ This was outside the class before — now fixed
    public function getInvoicecondition()
    {
        $customer = JWTAuth::parseToken()->authenticate();
        $terms = Term::latest()
        ->where('created_by',$customer->id)
        ->get();
        return response()->json($terms);
    }

    // Update an existing record
    public function update(Request $request, $id)
    {
        $termscondition = Termscondition::find($id);

        if (!$termscondition) {
            return response()->json(['message' => 'Record not found!'], 404);
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
        ]);

        $termscondition->update($request->all());
        return response()->json(['message' => 'Record updated successfully!', 'data' => $termscondition]);
    }

    // Delete a record
    public function destroy($id)
    {
        $termscondition = Termscondition::find($id);

        if (!$termscondition) {
            return response()->json(['message' => 'Record not found!'], 404);
        }

        $termscondition->delete();
        return response()->json(['message' => 'Record deleted successfully!']);
    }
}
