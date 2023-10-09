<?php

namespace App\Http\Middleware;

use Auth0\SDK\Auth0;
use Auth0\SDK\Token;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
//use Illuminate\Filesystem\FilesystemAdapter;
use Symfony\Component\Cache\Adapter\FilesystemAdapter;
use Illuminate\Support\Facades\Log;

class CheckIdToken
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $configure = [
            'domain'       => config('auth0.domain'),
            'clientId'     => config('auth0.clientId'),
            'clientSecret' => config('auth0.clientSecret'),
            'cookieSecret' => config('auth0.cookieSecret'),
            'tokenJwksUri' => 'https://'.config('auth0.domain').'/.well-known/jwks.json',
            'tokenCache' => null,
            'tokenCacheTtl' => 43200,
            'tokenAlgorithm' => 'RS256', 
            'audience' => [config('auth0.audience')],
        ];


        $auth0 = new Auth0($configure);

        // SDKの設定でキャッシュを有効化させる
        $tokenCache = new FilesystemAdapter();
        $auth0->configuration()->setTokenCache($tokenCache);
        

        // リクエストヘッダにBearerトークンが存在するか確認
        if (empty($request->bearerToken())) {
            return response()->json(["message" => "Token dose not exist"], 401);
        }

        $id_token = $request->bearerToken();
        //Log::debug($id_token);
        //Log::debug(utf8_encode(base64_decode($id_token)));

        // IDトークンの検証・デコード
        try {
            $auth0->decode($id_token, null, null, null, null, null, null, Token::TYPE_ID_TOKEN);
        } catch (\Exception $e) {
            return response()->json([
                "message" => config('app.debug') ? $e->getMessage() : "401: Unauthorized"
            ], 401);
        }

        $token = new Token($auth0->configuration(), $id_token, Token::TYPE_ID_TOKEN);
        $payload = json_decode($token->toJson()); //IDトークンに格納されたClaimを取得

        // user_idを$requestに追加する
        $request->merge([
            'auth0_user_id' => $payload->sub
        ]);

        return $next($request);
    }
}
