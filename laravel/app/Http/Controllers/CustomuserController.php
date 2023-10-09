<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Customuser;
use Illuminate\Support\Facades\Log;

class CustomuserController extends Controller
{
    public function getAllCustomuserUuid(Customuser $customuser){
        //return response()->json($customuser->get(['uuid'])->all());
        return response()->json($customuser->get()->all());
    }

    public function getLoginCustomuser(Request $request, Customuser $customuser){
        //Log::debug($request->auth0_user_id);

        $requested_customuser = Customuser::where('sub', '=', $request->auth0_user_id)->first();
        if ($requested_customuser === null){
            return response()->json("error:requested custom user not found");
        }
        else{
            return response()->json($requested_customuser);
        }
    }

    public function uuid2Nickname(Request $request){
        //Log::debug($request);
        $requested_customuser = Customuser::where('uuid', '=', $request->user_uuid)->first();
        if ($requested_customuser === null){
            return response()->json("error:requested custom user not found");
        }
        else{
            return response()->json($requested_customuser->nickname);
        }
    }

    public function getCustomuser(Request $request, Customuser $customuser){
        //Log::debug($request->auth0_user_id);

        $requested_customuser = Customuser::where('sub', '=', $request->auth0_user_id)->first();
        if ($requested_customuser === null){
            return response()->json("error:requested custom user not found");
        }
        else{
            return response()->json($requested_customuser);
        }
        
        
    }
}
