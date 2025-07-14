<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    Route::apiResources([
        'orgs' => \App\Http\Controllers\APIv1\OrgController::class,
        'projects' => \App\Http\Controllers\APIv1\ProjectController::class,
        'clients' => \App\Http\Controllers\APIv1\ClientController::class,
    ]);

    Route::get('menus', [\App\Http\Controllers\APIv1\MenuController::class, 'index']);
});
