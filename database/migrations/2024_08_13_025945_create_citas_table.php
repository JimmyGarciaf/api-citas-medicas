<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('citas', function (Blueprint $table) {
            $table->id('idCitas')->primary(); // ID de la cita
            $table->string('idPacientes'); // Llave foránea
            $table->string('Nombre_Paciente'); // Nombre del paciente
            $table->enum('Genero', ['Hombre', 'Mujer']); // Género del paciente
            $table->string('Celular'); // Celular del paciente
            $table->string('Correo'); // Correo del paciente
            $table->dateTime('Fecha_Cita'); // Fecha de la cita
            $table->string('Doctor_Consultor'); // Nombre del doctor
            $table->string('Tratamiento'); // Tratamiento
            $table->text('Notas'); // Notas adicionales 

            $table->foreign('idPacientes')->references('idPacientes')->on('pacientes')
                  ->onDelete('cascade')->onUpdate('cascade'); // Llave foránea

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('citas');
    }
};
