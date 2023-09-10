<?php

namespace App\Http\Controllers;
use App\Models\Post;
use Illuminate\Http\Request;

class PostController extends Controller
{
    public function index(Post $post){
        //dd(response()->json($post->get()->all()));
        return response()->json($post->get()->all());
    }

    public function show(Post $post){
        return response()->json($post);
    }

    public function create(Post $post, Request $request){
        $input = $request["data"];
        $post->fill($input)->save();
        return response()->json($post->id);
    }

    public function edit(Post $post, Request $request){
        $input = $request["data"];
        $post->fill($input)->save();
        return response()->json($post->id);
    }

    public function delete(Post $post){
        $post->delete();
        return;
    }
}
