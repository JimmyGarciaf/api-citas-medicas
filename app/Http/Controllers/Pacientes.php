<?php

namespace App\Http\Controllers;

use App\Models\Empleado;
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
            'Departamento' => 'required|string|max:20',
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
            'Departamento' => 'sometimes|required|string|max:20',
            'Celular' => 'sometimes|required|string|max:15',
            'Correo' => 'sometimes|required|string|email|max:25|unique:pacientes,correo,' . $paciente->idPacientes . ',idPacientes',
            'Genero' => 'sometimes|required|in:Hombre,Mujer',
        ]);

        // Actualiza los datos del paciente
        $paciente->update($validatedData);

        return response()->json($paciente);
    }

    // Eliminar un paciente específico
    public function destroy($idPacientes)
    {
        $paciente = Paciente::where('idPacientes', $idPacientes)->firstOrFail();
        $paciente->delete();
        return response()->json(['message' => 'Paciente eliminado exitosamente']);
    }

    // Obtener los pacientes recientes
    public function recent()
    {
        // Suponiendo que 'created_at' es el campo de marca de tiempo
        $recentPatients = Paciente::orderBy('created_at', 'desc')->take(5)->get();
        return response()->json($recentPatients);
    }

    // Método para transferir datos de Empleado a Paciente
    public function transferData()
    {
        try {
            // Extraer datos de la base de datos secundaria
            $empleados = Empleado::all();
        
            // Preparar datos para insertar en la base de datos principal
            $pacientesData = $empleados->map(function ($empleado) {
                return [
                    'idPacientes' => $empleado->exp_codigo_alternativo,  // Asigna el exp_codigo_alternativo como idPacientes
                    'Nombre_Paciente' => $empleado->exp_nombres_apellidos,
                    'Departamento' => $empleado->plz_nombre, // Asigna como departamento (ajusta si es necesario)
                    'Celular' => '',  // Ajusta o completa el campo si es necesario
                    'Correo' => '',   // Ajusta o completa el campo si es necesario
                    'Genero' => $empleado->exp_sexo == 'M' ? 'Hombre' : 'Mujer',  // Asigna el género basado en exp_sexo
                ];
            });
        
            // Insertar datos en la base de datos principal
            foreach ($pacientesData as $data) {
                Paciente::updateOrCreate(
                    ['idPacientes' => $data['idPacientes']], // Buscamos por idPacientes para actualizar o crear
                    $data
                );
            }
        
            return response()->json(['message' => 'Datos transferidos exitosamente'], 200);
        
        } catch (\Exception $e) {
            // Manejo de errores en caso de que algo falle
            return response()->json([
                'error' => 'Error al transferir datos',
                'details' => $e->getMessage()
            ], 500);
        }
    }

}
