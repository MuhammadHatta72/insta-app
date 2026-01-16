<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class PostController extends Controller
{
    public function index()
    {
        $posts = Post::with(['user', 'comments.user'])
            ->withCount(['likes', 'comments'])
            ->latest()
            ->paginate(10)
            ->through(fn($post) => [
                'id' => $post->id,
                'caption' => $post->caption,
                'image_path' => $post->image_path ? Storage::url($post->image_path) : null,
                'user' => [
                    'id' => $post->user->id,
                    'name' => $post->user->name,
                ],
                'likes_count' => $post->likes_count,
                'comments_count' => $post->comments_count,
                'is_liked' => $post->isLikedBy(auth()->user()),
                'comments' => $post->comments->take(3),
                'created_at' => $post->created_at->diffForHumans(),
            ]);

        return Inertia::render('Posts/Index', [
            'posts' => $posts,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'caption' => 'nullable|string|max:2200',
            'image' => 'required|image|max:10240', // 10MB max
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('posts', 'public');
        }

        $request->user()->posts()->create([
            'caption' => $validated['caption'],
            'image_path' => $imagePath,
        ]);

        return redirect()->route('posts.index');
    }

    public function destroy(Post $post)
    {
        $this->authorize('delete', $post);

        if ($post->image_path) {
            Storage::disk('public')->delete($post->image_path);
        }

        $post->delete();

        return redirect()->route('posts.index');
    }
}
