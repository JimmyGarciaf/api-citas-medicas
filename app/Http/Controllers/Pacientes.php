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
            'idPacientes' => 'required|string|max:20|unique:pacientes',
            'nombre' => 'required|string|max:255',
            'correo' => 'required|string|email|max:255|unique:pacientes',
            'celular' => 'required|string|max:20',
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
        $paciente = Paciente::where('idPacientes', $idPacientes)->firstOrFail();

        $validatedData = $request->validate([
            'idPacientes' => 'sometimes|required|string|max:20|unique:pacientes,idPacientes,' . $paciente->idPacientes,
            'nombre' => 'sometimes|required|string|max:255',
            'correo' => 'sometimes|required|string|email|max:255|unique:pacientes,correo,' . $paciente->idPacientes,
            'celular' => 'sometimes|required|string|max:20',
        ]);

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
