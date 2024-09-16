<?php

namespace App\Http\Controllers;

use App\Models\Cita;
use Illuminate\Http\Request;

class Citas extends Controller
{
    // Mostrar una lista de citas
    public function index()
    {
        $citas = Cita::all();
        return response()->json($citas);
    }

    // Crear una nueva cita
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'idPacientes' => 'required|string|exists:pacientes,idPacientes',
            'Nombre_Paciente' => 'required|string|max:50',
            'Genero' => 'required|in:Hombre,Mujer',
            'Celular' => 'required|string|max:15',
            'Correo' => 'required|string|email|max:25',
            'Fecha_Cita' => 'required|date_format:Y-m-d', // Asegúrate de que el formato sea correcto
            'Doctor_Consultor' => 'required|string|max:25',
            'Diagnostico' => 'required|string|max:255',
            'Tratamiento' => 'required|string|max:255',
            'Notas' => 'required|string|max:255',
            'Estado' => 'required|string|max:10',
        ]);

        $cita = Cita::create($validatedData);
        return response()->json($cita, 201);
    }

    // Mostrar una cita específica
    public function show($idCitas)
    {
        $cita = Cita::where('idCitas', $idCitas)->firstOrFail();
        return response()->json($cita);
    }

    // Actualizar una cita específica
    public function update(Request $request, $idCitas)
    {
        $cita = Cita::where('idCitas', $idCitas)->firstOrFail();

        $validatedData = $request->validate([
            'idPacientes' => 'sometimes|required|string|exists:pacientes,idPacientes',
            'Nombre_Paciente' => 'sometimes|required|string|max:50',
            'Genero' => 'sometimes|required|in:Hombre,Mujer',
            'Celular' => 'sometimes|required|string|max:15',
            'Correo' => 'sometimes|required|string|email|max:25',
            'Fecha_Cita' => 'sometimes|required|date_format:Y-m-d', // Asegúrate de que el formato sea correcto
            'Doctor_Consultor' => 'sometimes|required|string|max:25',
            'Diagnostico' => 'required|string|max:255',
            'Tratamiento' => 'sometimes|required|string|max:255',
            'Notas' => 'sometimes|required|string|max:255',
            'Estado' => 'sometimes|required|string|max:10',
        ]);

        $cita->update($validatedData);
        return response()->json($cita);
    }

    // Eliminar una cita específica
    public function destroy($idCitas)
    {
        $cita = Cita::where('idCitas', $idCitas)->firstOrFail();
        $cita->delete();
        return response()->json(['message' => 'Cita eliminada exitosamente']);
    }
    public function upcoming()
{
    // Obtener las próximas 10 citas (puedes ajustar esto según tus necesidades)
    $upcomingAppointments = Cita::orderBy('fecha_cita', 'asc')->take(10)->get();
    
    // Retornar las citas próximas como una respuesta JSON
    return response()->json($upcomingAppointments);
}

}
