<?php

namespace Database\Seeders;

use App\Models\Post;
use App\Models\User;
use App\Models\Comment;
use Illuminate\Database\Seeder;

class CommentSeeder extends Seeder
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

        $commentTexts = [
            'Great post! 👍',
            'Love this! ❤️',
            'Amazing content 🔥',
            'Thanks for sharing!',
            'This is awesome 😍',
            'Totally agree with you',
            'Well said! 💯',
            'This made my day',
            'Absolutely beautiful',
            'Keep it up! 🚀',
        ];

        foreach ($posts as $post) {
            // Add 2-4 comments per post
            $commentCount = rand(2, 4);

            for ($i = 0; $i < $commentCount; $i++) {
                $randomUser = $users->random();

                Comment::create([
                    'post_id' => $post->id,
                    'user_id' => $randomUser->id,
                    'content' => $commentTexts[array_rand($commentTexts)],
                    'parent_id' => null,
                ]);
            }
        }
    }
}
