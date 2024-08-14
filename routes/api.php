<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Pacientes;
use App\Http\Controllers\DoctorController;
use App\Http\Controllers\Citas;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Aquí es donde puede registrar rutas API para su aplicación. Estos
| las rutas son cargadas por el RouteServiceProvider y todas ellas
| asignarse al grupo de middleware "api". ¡Haz algo genial!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::group([
 
    //'middleware' => 'auth:api',
    'prefix' => 'auth'
 
], function ($router) {
    Route::post('/register', [AuthController::class, 'register'])->name('register');
    Route::post('/login', [AuthController::class, 'login'])->name('login');
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
    Route::post('/refresh', [AuthController::class, 'refresh'])->name('refresh');
    Route::post('/me', [AuthController::class, 'me'])->name('me');
});

Route::group([
    'prefix' => 'pacientes'
], function () {
    Route::get('/', [Pacientes::class, 'index']);
    Route::post('/', [Pacientes::class, 'store']);
    Route::get('/{idPacientes}', [Pacientes::class, 'show']);
    Route::put('/{idPacientes}', [Pacientes::class, 'update']);
    Route::delete('/{idPacientes}', [Pacientes::class, 'destroy']);
});

Route::group([
    'prefix' => 'doctores'
], function () {
    Route::get('/', [DoctorController::class, 'index']);
    Route::post('/', [DoctorController::class, 'store']);
    Route::get('/{idDoctores}', [DoctorController::class, 'show']);
    Route::put('/{idDoctores}', [DoctorController::class, 'update']); // Probar con patch
    Route::delete('/{idDoctores}', [DoctorController::class, 'destroy']);
});

Route::group([
    'prefix' => 'citas'
], function () {
    Route::get('/', [Citas::class, 'index']);
    Route::post('/', [Citas::class, 'store']);
    Route::get('/{idCitas}', [Citas::class, 'show']);
    Route::put('/{idCitas}', [Citas::class, 'update']);
    Route::delete('/{idCitas}', [Citas::class, 'destroy']);
});
