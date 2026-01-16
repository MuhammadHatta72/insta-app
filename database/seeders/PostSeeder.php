<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Post;
use Illuminate\Database\Seeder;

class PostSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::all();

        if ($users->isEmpty()) {
            return;
        }

        $captions = [
            'Enjoying a beautiful sunset! 🌅',
            'Coffee and code - my perfect morning ☕️💻',
            'Exploring new places 🗺️',
            'Life is beautiful 💫',
            'Just another day at the office 😎',
            'Weekend vibes ✨',
            'Creating something awesome 🚀',
            'Nature is healing 🌿',
            'Living my best life 🌟',
            'Grateful for this moment 🙏',
        ];

        foreach ($users as $user) {
            for ($i = 0; $i < 3; $i++) {
                $post = Post::create([
                    'user_id' => $user->id,
                    'caption' => $captions[array_rand($captions)],
                ]);
            }
        }
    }
}
