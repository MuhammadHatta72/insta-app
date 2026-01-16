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
        $posts = Post::with(['user', 'media', 'comments' => function ($query) {
            $query->whereNull('parent_id')->with(['user', 'replies.user']);
        }])
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
                    'avatar_path' => $post->user->avatar_path,
                ],
                'likes_count' => $post->likes_count,
                'comments_count' => $post->comments_count,
                'is_liked' => auth()->check() ? $post->isLikedBy(auth()->user()) : false,
                'comments' => $post->comments->map(fn($c) => [
                    'id' => $c->id,
                    'content' => $c->content,
                    'post_id' => $c->post_id,
                    'user' => [
                        'id' => $c->user->id,
                        'name' => $c->user->name,
                        'avatar_path' => $c->user->avatar_path,
                    ],
                    'created_at' => $c->created_at->diffForHumans(),
                    'replies' => $c->replies->map(fn($r) => [
                        'id' => $r->id,
                        'content' => $r->content,
                        'user' => [
                            'id' => $r->user->id,
                            'name' => $r->user->name,
                            'avatar_path' => $r->user->avatar_path,
                        ],
                        'created_at' => $r->created_at->diffForHumans(),
                    ]),
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

    public function userPosts()
    {
        $posts = auth()->user()->posts()
            ->with(['user', 'media', 'comments' => function ($query) {
                $query->whereNull('parent_id')->with(['user', 'replies.user']);
            }])
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
                    'avatar_path' => $post->user->avatar_path,
                ],
                'likes_count' => $post->likes_count,
                'comments_count' => $post->comments_count,
                'is_liked' => auth()->check() ? $post->isLikedBy(auth()->user()) : false,
                'comments' => $post->comments->map(fn($c) => [
                    'id' => $c->id,
                    'content' => $c->content,
                    'post_id' => $c->post_id,
                    'user' => [
                        'id' => $c->user->id,
                        'name' => $c->user->name,
                        'avatar_path' => $c->user->avatar_path,
                    ],
                    'created_at' => $c->created_at->diffForHumans(),
                    'replies' => $c->replies->map(fn($r) => [
                        'id' => $r->id,
                        'content' => $r->content,
                        'user' => [
                            'id' => $r->user->id,
                            'name' => $r->user->name,
                            'avatar_path' => $r->user->avatar_path,
                        ],
                        'created_at' => $r->created_at->diffForHumans(),
                    ]),
                ]),
                'created_at' => $post->created_at->diffForHumans(),
            ]);

        return Inertia::render('Dashboard', [
            'posts' => $posts,
            'auth' => [
                'user' => auth()->user(),
            ],
        ]);
    }

    public function dashboard()
    {
        $user = auth()->user();

        $stats = [
            'total_posts' => $user->posts()->count(),
            'total_likes' => $user->posts()->withCount('likes')->get()->sum('likes_count'),
            'total_comments' => $user->posts()->withCount('comments')->get()->sum('comments_count'),
        ];

        return inertia('Dashboard', [
            'stats' => $stats,
        ]);
    }

    public function myPosts()
    {
        $posts = auth()->user()->posts()
            ->with(['media', 'user', 'likes', 'comments' => function ($query) {
                $query->whereNull('parent_id')->with(['user', 'replies.user']);
            }])
            ->withCount(['likes', 'comments'])
            ->latest()
            ->paginate(12)
            ->through(fn($post) => [
                'id' => $post->id,
                'caption' => $post->caption,
                'media' => $post->media->sortBy('order')->map(fn($m) => [
                    'id' => $m->id,
                    'media_path' => $this->getMediaUrl($m->media_path),
                    'media_type' => $m->media_type,
                    'order' => $m->order,
                ])->values()->all(),
                'user' => [
                    'id' => $post->user->id,
                    'name' => $post->user->name,
                    'avatar_path' => $post->user->avatar_path,
                ],
                'likes_count' => $post->likes_count,
                'comments_count' => $post->comments_count,
                'is_liked' => auth()->check() ? $post->isLikedBy(auth()->user()) : false,
                'comments' => $post->comments->map(fn($c) => [
                    'id' => $c->id,
                    'content' => $c->content,
                    'post_id' => $c->post_id,
                    'user' => [
                        'id' => $c->user->id,
                        'name' => $c->user->name,
                        'avatar_path' => $c->user->avatar_path,
                    ],
                    'created_at' => $c->created_at->diffForHumans(),
                    'replies' => $c->replies->map(fn($r) => [
                        'id' => $r->id,
                        'content' => $r->content,
                        'user' => [
                            'id' => $r->user->id,
                            'name' => $r->user->name,
                            'avatar_path' => $r->user->avatar_path,
                        ],
                        'created_at' => $r->created_at->diffForHumans(),
                    ]),
                ]),
                'created_at' => $post->created_at->diffForHumans(),
            ]);

        return inertia('MyPost', [
            'posts' => $posts,
        ]);
    }

    private function getMediaUrl($mediaPath)
    {
        if (str_starts_with($mediaPath, 'http://') || str_starts_with($mediaPath, 'https://')) {
            return $mediaPath;
        }

        if (str_starts_with($mediaPath, '/')) {
            return $mediaPath;
        }

        if (str_starts_with($mediaPath, 'assets/')) {
            return Storage::disk('assets')->url($mediaPath);
        }

        return Storage::disk('public')->url($mediaPath);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'caption' => 'nullable|string|max:2200',
            'media' => 'required|array|min:1|max:10',
            'media.*' => 'required|file|mimes:jpeg,png,jpg,gif,mp4,mov,avi|max:51200',
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

        $post = $post->load(['media', 'user', 'comments.user']);

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
                        'avatar_path' => $post->user->avatar_path,
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
        if (auth()->id() !== $post->user_id) {
            abort(403, 'Unauthorized');
        }

        foreach ($post->media as $media) {
            if (!str_starts_with($media->media_path, 'assets/')) {
                Storage::disk('public')->delete($media->media_path);
            }
        }

        $post->delete();

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Post deleted successfully',
            ]);
        }

        return redirect()->route('posts.my');
    }

    public function update(Request $request, Post $post)
    {
        if (auth()->id() !== $post->user_id) {
            abort(403, 'Unauthorized');
        }

        $validated = $request->validate([
            'caption' => 'nullable|string|max:2200',
            'media' => 'nullable|array|max:10',
            'media.*' => 'nullable|file|mimes:jpeg,png,jpg,gif,mp4,mov,avi|max:51200',
            'keep_media_ids' => 'nullable|string',
        ]);

        $post->update([
            'caption' => $validated['caption'],
        ]);

        $keepMediaIds = [];
        if ($validated['keep_media_ids']) {
            $keepMediaIds = json_decode($validated['keep_media_ids'], true) ?? [];
        }

        $maxOrder = $post->media()
            ->whereIn('id', $keepMediaIds)
            ->max('order') ?? -1;

        $mediaToDelete = $post->media()->whereNotIn('id', $keepMediaIds)->get();
        foreach ($mediaToDelete as $media) {
            if (!str_starts_with($media->media_path, 'assets/')) {
                Storage::disk('public')->delete($media->media_path);
            }
        }

        $post->media()->whereNotIn('id', $keepMediaIds)->delete();

        if ($request->hasFile('media')) {
            foreach ($request->file('media') as $index => $file) {
                $path = $file->store('posts/' . $post->id, 'public');
                $mimeType = $file->getMimeType();

                $mediaType = str_starts_with($mimeType, 'video/') ? 'video' : 'image';

                $post->media()->create([
                    'media_path' => $path,
                    'media_type' => $mediaType,
                    'order' => $maxOrder + $index + 1,
                ]);
            }
        }

        $post->load(['media', 'user', 'comments.user']);

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Post updated successfully',
                'post' => [
                    'id' => $post->id,
                    'caption' => $post->caption,
                    'media' => $post->media->sortBy('order')->map(fn($m) => [
                        'id' => $m->id,
                        'media_path' => $this->getMediaUrl($m->media_path),
                        'media_type' => $m->media_type,
                        'order' => $m->order,
                    ])->values()->all(),
                    'user' => [
                        'id' => $post->user->id,
                        'name' => $post->user->name,
                        'avatar_path' => $post->user->avatar_path,
                    ],
                    'likes_count' => $post->likes_count,
                    'comments_count' => $post->comments_count,
                    'is_liked' => auth()->check() ? $post->isLikedBy(auth()->user()) : false,
                    'comments' => $post->comments->map(fn($c) => [
                        'id' => $c->id,
                        'content' => $c->content,
                        'post_id' => $c->post_id,
                        'user' => [
                            'id' => $c->user->id,
                            'name' => $c->user->name,
                            'avatar_path' => $c->user->avatar_path,
                        ],
                        'created_at' => $c->created_at->diffForHumans(),
                        'replies' => $c->replies->map(fn($r) => [
                            'id' => $r->id,
                            'content' => $r->content,
                            'user' => [
                                'id' => $r->user->id,
                                'name' => $r->user->name,
                                'avatar_path' => $r->user->avatar_path,
                            ],
                            'created_at' => $r->created_at->diffForHumans(),
                        ]),
                    ]),
                    'created_at' => $post->created_at->diffForHumans(),
                ],
            ]);
        }

        return redirect()->route('posts.index');
    }
}
