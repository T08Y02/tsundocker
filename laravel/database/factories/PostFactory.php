<?php

namespace Database\Factories;

use App\Models\Post;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Post>
 */
class PostFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */

     protected $model = Post::class;

    public function definition(): array
    {
        $images = [
            "https://res.cloudinary.com/diwpdgc8g/image/upload/v1694399635/hgo3gmhscx8bejxqmwk3.jpg", 
            "https://res.cloudinary.com/diwpdgc8g/image/upload/v1694399770/ycmypvsmggr0w4iluvuu.jpg",
            "https://res.cloudinary.com/diwpdgc8g/image/upload/v1694399474/i76ia8xrwwn9hku6rg84.png",
            "https://res.cloudinary.com/diwpdgc8g/image/upload/v1694399784/duelc8s5ptvatcttwiqm.jpg",
            "https://res.cloudinary.com/diwpdgc8g/image/upload/v1694399807/cx6ptzw9xo3oazrr5rsn.png",
            "https://res.cloudinary.com/diwpdgc8g/image/upload/v1694399990/p0qwimnlsqck03nnvgyc.jpg", 
            "https://res.cloudinary.com/diwpdgc8g/image/upload/v1694400026/dzxqnieps4kkb6hfg9hp.jpg",
        ];
        return [
            'title' => fake()->word,
            'body' => fake()->text($maxNbChars = 6),
            'progress' => rand(0, 100),
            'img_url' => fake()->randomElement($images),
            'customuser_id' => '1', 
        ];
    }
}
