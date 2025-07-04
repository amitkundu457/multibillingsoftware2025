<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Tabs;
use Illuminate\Http\Request;

class TabsController extends Controller
{
    public function index()
    {
        $tabs = Tabs::all();
        return response()->json(['success' => true, 'data' => $tabs], 200);
    }


    public function store(Request $request)
{
    $validated = $request->validate([
        'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        'title' => 'required|string|max:255',
        'descrition' => 'nullable|string',
        'icon' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
    ]);

    // Handle the image file upload
    if ($request->hasFile('image')) {
        $imageName = time() . '_image.' . $request->image->extension();
        $request->image->move(public_path('images/tabs'), $imageName);
        $validated['image'] = 'images/tabs/' . $imageName;
    }

    // Handle the icon file upload
    if ($request->hasFile('icon')) {
        $iconName = time() . '_icon.' . $request->icon->extension();
        $request->icon->move(public_path('images/tabs/icons'), $iconName);
        $validated['icon'] = 'images/tabs/icons/' . $iconName;
    }

    $tab = Tabs::create($validated);

    return response()->json(['success' => true, 'data' => $tab], 201);
}


public function update(Request $request, $id)
{
    // Fetch the tab record by ID
    $tab = Tabs::findOrFail($id); // Replace `Tab` with the actual model name if different

    // Validate the incoming request
    $validated = $request->validate([
        'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        'title' => 'required|string|max:255',
        'description' => 'nullable|string', // Fixed typo from 'descrition' to 'description'
        'icon' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
    ]);

    // Handle the image file upload
    if ($request->hasFile('image')) {
        // Delete old image if it exists
        if ($tab->image && file_exists(public_path($tab->image))) {
            unlink(public_path($tab->image));
        }

        // Upload new image
        $imageName = time() . '_image.' . $request->image->extension();
        $request->image->move(public_path('images/tabs'), $imageName);
        $validated['image'] = 'images/tabs/' . $imageName;
    }

    // Handle the icon file upload
    if ($request->hasFile('icon')) {
        // Delete old icon if it exists
        if ($tab->icon && file_exists(public_path($tab->icon))) {
            unlink(public_path($tab->icon));
        }

        // Upload new icon
        $iconName = time() . '_icon.' . $request->icon->extension();
        $request->icon->move(public_path('images/tabs/icons'), $iconName);
        $validated['icon'] = 'images/tabs/icons/' . $iconName;
    }

    // Update the tab record
    $tab->update($validated);

    return response()->json(['success' => true, 'data' => $tab], 200);
}



public function destroy(Tabs $tab)
{
    if ($tab->image && file_exists(public_path($tab->image))) {
        unlink(public_path($tab->image));
    }

    $tab->delete();

    return response()->json(['success' => true, 'message' => 'Tab deleted successfully.'], 200);
}

    
}
