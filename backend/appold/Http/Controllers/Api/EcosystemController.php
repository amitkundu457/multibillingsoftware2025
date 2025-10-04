<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Ecosydtem;

class EcosystemController extends Controller
{

    public function index()
    {
        return  Ecosydtem::all();
        // return view('ecosystems.index', compact('ecosystems'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif',
            'description' => 'required|string|max:255',
        ]);

        $imagePath = null;

        if ($request->file('image')) {
            $image = $request->file('image');
            $imageName = time() . '.' . $image->getClientOriginalExtension();
            $image->move(public_path('uploads/ecosystems'), $imageName);
            $imagePath = 'uploads/ecosystems/' . $imageName;
        }

        Ecosydtem::create([
            'image' => $imagePath,
            'description' => $request->description,
        ]);

        return response()->json(['success' => 'Ecosystem created successfully.']);
    }


    public function update(Request $request, $id)
    {
        $request->validate([
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'description' => 'required|string|max:255',
        ]);

        $ecosystem = Ecosydtem::findOrFail($id);

        if ($request->file('image')) {
            // Delete old image
            if (file_exists(public_path($ecosystem->image))) {
                unlink(public_path($ecosystem->image));
            }

            // Upload new image
            $image = $request->file('image');
            $imageName = time() . '.' . $image->getClientOriginalExtension();
            $image->move(public_path('uploads/ecosystems'), $imageName);
            $ecosystem->image = 'uploads/ecosystems/' . $imageName;
        }

        $ecosystem->description = $request->description;
        $ecosystem->save();

        return response()->json(['success' => 'Ecosystem updated successfully.']);
    }


    public function destroy($id)
    {
        $ecosystem = Ecosydtem::findOrFail($id);

        if (file_exists(public_path($ecosystem->image))) {
            unlink(public_path($ecosystem->image));
        }

        $ecosystem->delete();

        return response()->json(['success' => 'Ecosystem deleted successfully.']);
    }
}
