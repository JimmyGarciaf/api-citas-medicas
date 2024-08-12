<?php

namespace App\Http\Controllers;

use App\Models\Paciente;
use Illuminate\Http\Request;

class Pacientes extends Controller
{
    // Mostrar una lista de pacientes
    public function index()
    {
        $pacientes = Paciente::all();
        return response()->json($pacientes);
    }

    // Crear un nuevo paciente
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'idPacientes' => 'required|string|max:15|unique:pacientes',
            'Nombre_Paciente' => 'required|string|max:15',
            'Departamento' => 'required|integer',
            'Celular' => 'required|string|max:15',
            'Correo' => 'required|string|email|max:25|unique:pacientes',
            'Genero' => 'required|in:Hombre,Mujer'
        ]);

        $paciente = Paciente::create($validatedData);
        return response()->json($paciente, 201);
    }

    // Mostrar un paciente específico
    public function show($idPacientes)
    {
        $paciente = Paciente::where('idPacientes', $idPacientes)->firstOrFail();
        return response()->json($paciente);
    }

    // Actualizar un paciente específico
    public function update(Request $request, $idPacientes)
{
    // Encuentra el paciente usando el idPacientes
    $paciente = Paciente::where('idPacientes', $idPacientes)->firstOrFail();

    // Valida los datos del paciente
    $validatedData = $request->validate([
        'Nombre_Paciente' => 'sometimes|required|string|max:15',
        'Departamento' => 'sometimes|required|integer',  // Cambiado a string si es el nombre del departamento
        'Celular' => 'sometimes|required|string|max:15',
        'Correo' => 'sometimes|required|string|email|max:25|unique:pacientes,correo,' . $paciente->idPacientes . ',idPacientes',
        'Genero' => 'sometimes|required|in:Hombre,Mujer',
    ]);

    // Actualiza los datos del paciente
    $paciente->update($validatedData);

    return response()->json($paciente);
}

    // Eliminar un paciente específico (si es necesario añadir esta función)
    public function destroy($idPacientes)
    {
        $paciente = Paciente::where('idPacientes', $idPacientes)->firstOrFail();
        $paciente->delete();
        return response()->json(['message' => 'Paciente eliminado exitosamente']);
    }
}
