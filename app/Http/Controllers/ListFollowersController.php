<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ListFollowersController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(User $user): Response
    {
        $followers = $user
            ->followers()
            ->orderByPivot('created_at', 'desc')
            ->select('follower_id as id', 'name')
            ->addSelect(['following' => function ($query) {
                $query->select('id as following')
                    ->from('follower_user')
                    ->whereColumn('follower_id', Auth()->id())
                    ->whereColumn('user_id', 'users.id');
            }])
            ->get()
            ->makeHidden('pivot');

        return Inertia::render('Follow/Index', [
            'user' => $user->only(['id', 'name']),
            'followList' => fn() => $followers,
        ]);
    }
}
