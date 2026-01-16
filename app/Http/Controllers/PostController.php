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
        $posts = Post::with(['user', 'media', 'comments.user'])
            ->withCount(['likes', 'comments'])
            ->latest()
            ->paginate(10)
            ->through(fn($post) => [
                'id' => $post->id,
                'caption' => $post->caption,
                'media' => $post->media->map(fn($m) => [
                    'id' => $m->id,
                    'media_path' => $this->getMediaUrl($m->media_path),
                    'media_type' => $m->media_type,
                    'order' => $m->order,
                ]),
                'user' => [
                    'id' => $post->user->id,
                    'name' => $post->user->name,
                ],
                'likes_count' => $post->likes_count,
                'comments_count' => $post->comments_count,
                'is_liked' => auth()->check() ? $post->isLikedBy(auth()->user()) : false,
                'comments' => $post->comments->take(3)->map(fn($c) => [
                    'id' => $c->id,
                    'content' => $c->content,
                    'user' => [
                        'id' => $c->user->id,
                        'name' => $c->user->name,
                    ],
                    'created_at' => $c->created_at->diffForHumans(),
                ]),
                'created_at' => $post->created_at->diffForHumans(),
            ]);

        return Inertia::render('Posts/Index', [
            'posts' => $posts,
            'auth' => [
                'user' => auth()->user(),
            ],
        ]);
    }

    /**
     * Get the full media URL from media path
     */
    private function getMediaUrl($mediaPath)
    {
        // If already a full URL, return as is
        if (str_starts_with($mediaPath, 'http://') || str_starts_with($mediaPath, 'https://')) {
            return $mediaPath;
        }

        // If absolute path, return as is
        if (str_starts_with($mediaPath, '/')) {
            return $mediaPath;
        }

        // If it's an assets path, use assets disk
        if (str_starts_with($mediaPath, 'assets/')) {
            return Storage::disk('assets')->url($mediaPath);
        }

        // Otherwise use public disk (for uploaded posts)
        return Storage::disk('public')->url($mediaPath);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'caption' => 'nullable|string|max:2200',
            'media' => 'required|array|min:1|max:10',
            'media.*' => 'required|file|mimes:jpeg,png,jpg,gif,mp4,mov,avi|max:51200', // 50MB per file
        ]);

        $post = $request->user()->posts()->create([
            'caption' => $validated['caption'],
        ]);

        if ($request->hasFile('media')) {
            foreach ($request->file('media') as $index => $file) {
                $path = $file->store('posts/' . $post->id, 'public');
                $mimeType = $file->getMimeType();

                $mediaType = str_starts_with($mimeType, 'video/') ? 'video' : 'image';

                $post->media()->create([
                    'media_path' => $path,
                    'media_type' => $mediaType,
                    'order' => $index,
                ]);
            }
        }

        // Reload post with all relations
        $post = $post->load(['media', 'user', 'comments.user']);

        // Return JSON response for AJAX requests
        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Post created successfully',
                'post' => [
                    'id' => $post->id,
                    'caption' => $post->caption,
                    'media' => $post->media->map(fn($m) => [
                        'id' => $m->id,
                        'media_path' => $this->getMediaUrl($m->media_path),
                        'media_type' => $m->media_type,
                        'order' => $m->order,
                    ]),
                    'user' => [
                        'id' => $post->user->id,
                        'name' => $post->user->name,
                    ],
                    'likes_count' => 0,
                    'comments_count' => 0,
                    'is_liked' => false,
                    'comments' => [],
                    'created_at' => $post->created_at->diffForHumans(),
                ],
            ]);
        }

        return redirect()->route('posts.index');
    }

    public function destroy(Post $post)
    {
        // Check authorization
        if (auth()->id() !== $post->user_id) {
            abort(403, 'Unauthorized');
        }

        // Delete all media files
        foreach ($post->media as $media) {
            // Only delete files that were uploaded (not assets)
            if (!str_starts_with($media->media_path, 'assets/')) {
                Storage::disk('public')->delete($media->media_path);
            }
        }

        $post->delete();

        return redirect()->route('posts.index');
    }
}
