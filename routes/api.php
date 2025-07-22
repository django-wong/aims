<?php

use App\Http\Controllers\APIv1\ClientController;
use App\Http\Controllers\APIv1\CommentController;
use App\Http\Controllers\APIv1\MenuController;
use App\Http\Controllers\APIv1\OrgController;
use App\Http\Controllers\APIv1\ProjectController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('menus', [MenuController::class, 'index']);
    Route::apiResources([
        'projects' => ProjectController::class,
        'clients' => ClientController::class,
        'orgs' => OrgController::class,
        'users' => \App\Http\Controllers\APIv1\UserController::class,
        'vendors' => \App\Http\Controllers\APIv1\VendorController::class,
        'project-types' => \App\Http\Controllers\APIv1\ProjectTypeController::class,
        'comments' => CommentController::class,
    ]);
});
