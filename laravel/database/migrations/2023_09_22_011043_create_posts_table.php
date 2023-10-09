<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;


return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('posts', function (Blueprint $table) {
            $table->id();
            $table->uuid("uuid")->unique();
            $table->timestamps();
            $table->string('title', 50);
            $table->string('body', 200);
            $table->integer('progress')->unsigned()->default(0);
            $table->string('img_url')->nullable()->default("https://res.cloudinary.com/diwpdgc8g/image/upload/v1694399474/i76ia8xrwwn9hku6rg84.png");
            $table->foreignId('customuser_id')->constrained();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('posts');
    }
};
