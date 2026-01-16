<?php

use App\Http\Controllers\PostController;
use App\Http\Controllers\LikeController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ThemeController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect()->route('posts.index');
});

Route::get('/posts', [PostController::class, 'index'])->name('posts.index');

Route::middleware(['auth', 'verified'])->group(function () {
    // Theme
    Route::post('/theme/toggle', [ThemeController::class, 'toggle'])->name('theme.toggle');

    // Posts
    Route::post('/posts', [PostController::class, 'store'])->name('posts.store');
    Route::put('/posts/{post}', [PostController::class, 'update'])->name('posts.update');
    Route::delete('/posts/{post}', [PostController::class, 'destroy'])->name('posts.destroy');

    // Likes
    Route::post('/posts/{post}/like', [LikeController::class, 'toggle'])->name('likes.store');

    // Comments
    Route::post('/posts/{post}/comments', [CommentController::class, 'store'])->name('comments.store');
    Route::post('/comments/{comment}/reply', [CommentController::class, 'reply'])->name('comments.reply');

    // Profile
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::delete('/profile/avatar', [ProfileController::class, 'deleteAvatar'])->name('profile.delete-avatar');

    // Dashboard and My Posts
    Route::get('/dashboard', [PostController::class, 'dashboard'])->name('dashboard');
    Route::get('/my-posts', [PostController::class, 'myPosts'])->name('posts.my');
});

require __DIR__ . '/auth.php';
