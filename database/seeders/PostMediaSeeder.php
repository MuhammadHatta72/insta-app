<?php

namespace Database\Seeders;

use App\Models\Post;
use App\Models\PostMedia;
use Illuminate\Database\Seeder;

class PostMediaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $posts = Post::all();
        $dummyImage = 'assets/img/dummy.jpg';

        foreach ($posts as $post) {
            // Add 1-3 media files per post
            $mediaCount = rand(1, 3);

            for ($i = 0; $i < $mediaCount; $i++) {
                PostMedia::create([
                    'post_id' => $post->id,
                    'media_path' => $dummyImage,
                    'media_type' => 'image',
                    'order' => $i,
                ]);
            }
        }
    }
}
