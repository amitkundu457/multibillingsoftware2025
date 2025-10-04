<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Review;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
class ReviewController extends Controller
{
    public function store(Request $request) {
        // Validate input
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'shop_id' => 'required',
            'email' => 'required|email|max:255',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'required|string|max:1000',
        ]);

        // Save review to database
        $review = Review::create($validated);

        // Return a JSON response
        return response()->json([
            'message' => 'Review submitted successfully.',
            'review' => $review
        ], 201);
    }

    public function show(){
        $customer = JWTAuth::parseToken()->authenticate();
        return  Review::where('shop_id', $customer->id)->get();
    }


    public function reviewList()
{
    $customer = JWTAuth::parseToken()->authenticate();

    $data = Review::join('users', 'reviews.shop_id', '=', 'users.id')
        ->select(
            'reviews.id',
            'reviews.name as complain_username',
            'reviews.email as complain_email',
            'reviews.rating as complain_rating',
            'reviews.comment as complain_comment',
            'reviews.created_at as complain_created_at'
        )
        ->where('reviews.shop_id', $customer->id)
        ->get();

    return response()->json([
        'count' => $data->count(),
        'data' => $data
    ]);
}


    //delete the review
    public function deleteReview($id)
{
    $review = Review::find($id);

    if (!$review) {
        return response()->json(['message' => 'Review not found'], 404);
    }

    $review->delete();

    return response()->json(['message' => 'Review deleted successfully'], 200);
}


}
