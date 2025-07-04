<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ParcelType;


class ParcelTypeController extends Controller
{
    //
    // GET /api/parcel-types
    public function index()
    {
        return response()->json(ParcelType::all());
    }

    // POST /api/parcel-types
    public function store(Request $request)
    {
        $request->validate([
            'type' => 'required|string| ',
        ]);

        $parcelType = ParcelType::create($request->only('type'));

        return response()->json([
            'message' => 'Parcel type created successfully.',
            'data' => $parcelType
        ], 201);
    }

    // GET /api/parcel-types/{id}
    public function show($id)
    {
        $parcelType = ParcelType::findOrFail($id);
        return response()->json($parcelType);
    }

    // PUT /api/parcel-types/{id}
    public function update(Request $request, $id)
    {
        $request->validate([
            'type' => 'required|string|',
        ]);

        $parcelType = ParcelType::findOrFail($id);
        $parcelType->update($request->only('type'));

        return response()->json([
            'message' => 'Parcel type updated successfully.',
            'data' => $parcelType
        ]);
    }

    // DELETE /api/parcel-types/{id}
    public function destroy($id)
    {
        $parcelType = ParcelType::findOrFail($id);
        $parcelType->delete();

        return response()->json([
            'message' => 'Parcel type deleted successfully.'
        ]);
    }
}
