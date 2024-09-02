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
        $pacientes = Paciente::take(1000)->get();
        return response()->json($pacientes);
    }

    // Crear un nuevo paciente
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'idPacientes' => 'required|string|max:20|unique:pacientes',
            'Nombre_Paciente' => 'required|string|max:50',
            'Departamento' => 'required|string|max:25',
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
            'Nombre_Paciente' => 'sometimes|required|string|max:50',
            'Departamento' => 'sometimes|required|string|max:25',
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
        $recentPatients = Paciente::orderBy('created_at', 'desc')->get();
        return response()->json($recentPatients);
    }

    // Método para transferir datos de Empleado a Paciente
    public function transferData()
    {
        try {
            // Extraer datos de la base de datos secundaria
            $empleados = Empleado::all();
        
            if ($empleados->isEmpty()) {
                return response()->json(['message' => 'No se encontraron empleados para transferir.'], 400);
            }
        
            // Preparar datos para insertar en la base de datos principal
            $pacientesData = $empleados->map(function ($empleado) {
            
                // Verificar que idPacientes no sea nulo ni esté vacío
                if (empty($idPacientes)) {
                    // Agregar a la lista de errores y omitir este registro
                    $errores[] = "Empleado con código {$empleado->exp_codigo} tiene un idPacientes inválido.";
                    return null;
                }
            
                $departamento = substr($empleado->plz_nombre, 0, 20);
            
                return [
                    'idPacientes' => $empleado->exp_codigo_alternativo,  
                    'Nombre_Paciente' => $empleado->exp_nombres_apellidos,
                    'Departamento' => $departamento, 
                    'Celular' => '',  
                    'Correo' => '',   
                    'Genero' => $empleado->exp_sexo == 'M' ? 'Hombre' : 'Mujer',  
                ];
            })->filter(); // Filtrar los elementos nulos
        
            // Insertar datos en la base de datos principal
            foreach ($pacientesData as $data) {
                $paciente = Paciente::updateOrCreate(
                    ['idPacientes' => $data['idPacientes']],
                    $data
                );
            
                if (!$paciente) {
                    $errores[] = 'Error al insertar el paciente con id ' . $data['idPacientes'];
                }
            }
        
            if (!empty($errores)) {
                return response()->json([
                    'message' => 'Algunos datos no pudieron ser transferidos.',
                    'errors' => $errores
                ], 207); // Código 207: Multi-Status (indica que parte del proceso fue exitoso)
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
