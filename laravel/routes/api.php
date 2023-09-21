<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PostController;
use App\Http\Controllers\CustomuserController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

//customuser
Route::post('/getLoginCustomuser', [CustomuserController::class, 'getLoginCustomuser'])->middleware("auth0_id");
Route::post('/id2Nickname', [CustomuserController::class, 'id2Nickname']);

//post
Route::get('/posts', [PostController::class, 'index']);
Route::get('/posts/create', [PostController::class, 'test']);
Route::post('/posts/create', [PostController::class, 'create'])->middleware("auth0_id");
Route::put('/posts/{post}/edit', [PostController::class, 'edit']);
Route::delete('/posts/{post}/delete', [PostController::class, 'delete']);
Route::get('/posts/{post}', [PostController::class, 'show']);

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});



