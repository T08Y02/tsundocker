<?php

return [
    'domain' => env('AUTH0_DOMAIN'),
    'clientId' => env('AUTH0_CLIENT_ID'),
    'clientSecret' => env('AUTH0_CLIENT_SECRET'),
    'cookieSecret' => env('AUTH0_COOKIE_SECRET'),
    'supported_algs' => [ 'RS256' ],
    'audience' => env('AUTH0_AUDIENCE'),

];
