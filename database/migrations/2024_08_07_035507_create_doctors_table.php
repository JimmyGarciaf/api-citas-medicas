<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
{
    Schema::create('doctores', function (Blueprint $table) {
        $table->id('idDoctores');
        $table->string('Nombre_Doctor');
        $table->string('Departamento');
        $table->string('Celular');
        $table->string('Correo')->unique();
        $table->enum('Genero', ['Hombre', 'Mujer']);
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('doctors');
    }
};

