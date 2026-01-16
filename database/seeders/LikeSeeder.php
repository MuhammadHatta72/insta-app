<?php

namespace Database\Seeders;

use App\Models\Post;
use App\Models\User;
use App\Models\Like;
use Illuminate\Database\Seeder;

class LikeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $posts = Post::all();
        $users = User::all();

        if ($posts->isEmpty() || $users->isEmpty()) {
            return;
        }

        foreach ($posts as $post) {
            // Add 1-3 likes per post from random users
            $likesCount = rand(1, min(3, $users->count()));
            $randomUsers = $users->random($likesCount);

            foreach ($randomUsers as $user) {
                Like::create([
                    'post_id' => $post->id,
                    'user_id' => $user->id,
                ]);
            }
        }
    }
}
