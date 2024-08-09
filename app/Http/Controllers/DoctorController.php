<?php

namespace App\Http\Controllers;

use App\Models\Doctor;
use Illuminate\Http\Request;

class DoctorController extends Controller
{
    // Mostrar una lista de doctores
    public function index()
    {
        $doctores = Doctor::all();
        return response()->json($doctores);
    }

    // Crear un nuevo doctor
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'Nombre_Doctor' => 'required|string|max:255',
            'Departamento' => 'required|string|max:255',
            'Celular' => 'required|string|max:20',
            'Correo' => 'required|string|email|max:255|unique:doctores',
            'Genero' => 'required|in:Hombre,Mujer'
        ]);

        $doctor = Doctor::create($validatedData);
        return response()->json($doctor, 201);
    }

    // Mostrar un doctor específico
    public function show($idDoctores)
    {
        $doctor = Doctor::where('idDoctores', $idDoctores)->firstOrFail();
        return response()->json($doctor);
    }

    // Actualizar un doctor específico
    public function update(Request $request, $idDoctores)
    {
        $doctor = Doctor::where('idDoctores', $idDoctores)->firstOrFail();

        $validatedData = $request->validate([
            'Nombre_Doctor' => 'sometimes|required|string|max:255',
            'Departamento' => 'sometimes|required|string|max:255',
            'Celular' => 'sometimes|required|string|max:20',
            'Correo' => 'sometimes|required|string|email|max:255|unique:doctores,Correo,' . $idDoctores . ',idDoctores',
            'Genero' => 'sometimes|required|in:Hombre,Mujer',
        ]);

        $doctor->update($validatedData);
        return response()->json($doctor);
    }

    // Eliminar un doctor específico
    public function destroy($idDoctores)
    {
        $doctor = Doctor::where('idDoctores', $idDoctores)->firstOrFail();
        $doctor->delete();
        return response()->json(['message' => 'Doctor eliminado exitosamente']);
    }
}
