<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function store(Request $request, $postId)
    {
        $validated = $request->validate([
            'content' => 'required|string|max:500',
        ]);

        $comment = Comment::create([
            'post_id' => $postId,
            'user_id' => auth()->id(),
            'content' => $validated['content'],
            'parent_id' => null,
        ]);

        $comment->load('user');

        return response()->json([
            'success' => true,
            'comment' => [
                'id' => $comment->id,
                'content' => $comment->content,
                'post_id' => $comment->post_id,
                'user' => [
                    'id' => $comment->user->id,
                    'name' => $comment->user->name,
                ],
                'created_at' => $comment->created_at->diffForHumans(),
                'replies' => [],
            ],
        ]);
    }

    public function reply(Request $request, Comment $comment)
    {
        $validated = $request->validate([
            'content' => 'required|string|max:500',
        ]);

        $reply = Comment::create([
            'post_id' => $comment->post_id,
            'user_id' => auth()->id(),
            'content' => $validated['content'],
            'parent_id' => $comment->id,
        ]);

        $reply->load('user');

        return response()->json([
            'success' => true,
            'reply' => [
                'id' => $reply->id,
                'content' => $reply->content,
                'user' => [
                    'id' => $reply->user->id,
                    'name' => $reply->user->name,
                ],
                'created_at' => $reply->created_at->diffForHumans(),
            ],
        ]);
    }
}
