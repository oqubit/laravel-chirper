<?php

namespace App\Http\Controllers;

use App\Events\UserFollowed;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class FollowController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'id' => [
                'required',
                'integer',
                'numeric',
                Rule::notIn(Auth()->id()),
                'exists:users,id'
            ]
        ]);
        /** @var \App\Models\User */
        $authUser = auth()->user();
        $authUser->follows()->attach($validated['id']);
        $following = User::findOrFail($validated['id']);
        UserFollowed::dispatch($following, auth()->user());
        return back();
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): RedirectResponse
    {
        /** @var \App\Models\User */
        $authUser = auth()->user();
        $authUser->follows()->detach($id);
        return back();
    }
}
