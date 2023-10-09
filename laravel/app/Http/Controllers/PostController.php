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

    public function ones_index(Post $post, $user_uuid){
        //dd(response()->json($post->get()->all()));
        $selected_customuser = Customuser::where('uuid', '=', $user_uuid)->first();        
        return response()->json($selected_customuser->posts()->get()->all());
    }

    public function show(Post $post, Customuser $customuser){
        $customuser = $post->customuser()->first();
        return ["creator_uuid"=>$customuser->uuid,"post"=>$post];
        //return response()->json($post);
    }

    //ユーザが存在しない場合、新たにユーザを作成する
    public function create(Post $post, Request $request, Customuser $customuser){

        $login_customuser = Customuser::where('sub', '=', $request->auth0_user_id)->first();
        $input = ["title" => $request["title"], "body" => $request["body"]];
        
        if ($login_customuser === null){
            //Log::debug("isnull");
            $random_nickname = Str::random(10);
            $customuser->fill(['sub' => $request->auth0_user_id, "nickname" => $random_nickname, 'uuid' => Str::uuid(), ])->save();
            $input["customuser_id"] = $customuser->id;
        }
        else{
            $input["customuser_id"] = $login_customuser->id;
        }

        if ($request["image"]!== 'undefined'){
            $image_url = Cloudinary::upload($request["image"]->getRealPath())->getSecurePath();
            $input["img_url"] = $image_url;
        }

        $input['uuid'] = Str::uuid();
        
        $post->fill($input)->save();
        return response()->json($post->id);
    }

    public function edit(Post $post, Request $request, Customuser $creator){
        $creator = $post->customuser()->first();
        $login_customuser = Customuser::where('sub', '=', $request->auth0_user_id)->first();
        if ($creator->sub == $login_customuser->sub){
            $input = ["title" => $request["title"], "body" => $request["body"]];
            if ($request["image"]!== 'undefined'){
                $image_url = Cloudinary::upload($request["image"]->getRealPath())->getSecurePath();
                $input["img_url"] = $image_url;
            }
            
            $post->fill($input)->save();
            return response()->json($post->id);
        }
        else{
            Log::debug("invalid delete detected.");
            return ["edit -- permission denied."];
        }
    }

    public function delete(Post $post, Request $request, Customuser $creator){
        $creator = $post->customuser()->first();
        $login_customuser = Customuser::where('sub', '=', $request->auth0_user_id)->first();
        if ($creator->sub == $login_customuser->sub){
            $post->delete();
            return("success");
        }
        else{
            Log::debug("invalid delete detected.");
            return ("delete -- permission denied.");
        }
        
    }
}
