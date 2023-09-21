<?php

namespace App\Http\Controllers;
use App\Models\Post;
use App\Models\Customuser;
use Illuminate\Http\Request;
use Cloudinary;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class PostController extends Controller
{
    public function index(Post $post){
        //dd(response()->json($post->get()->all()));
        return response()->json($post->get()->all());
    }

    public function show(Post $post){
        return response()->json($post);
    }

    public function create(Post $post, Request $request, Customuser $customuser){
        Log::debug($request->auth0_user_id);

        $login_customuser = Customuser::where('sub', '=', $request->auth0_user_id)->first();
        $input = ["title" => $request["title"], "body" => $request["body"]];
        
        if ($login_customuser === null){
            //Log::debug("isnull");
            $random_nickname = Str::random(10);
            $customuser->fill(['sub' => $request->auth0_user_id, "nickname" => $random_nickname])->save();
            $input["customuser_id"] = $customuser->id;
        }
        else{
            $input["customuser_id"] = $login_customuser->id;
        }

        if ($request["image"]!== 'undefined'){
            $image_url = Cloudinary::upload($request["image"]->getRealPath())->getSecurePath();
            $input["img_url"] = $image_url;
        }
        
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
