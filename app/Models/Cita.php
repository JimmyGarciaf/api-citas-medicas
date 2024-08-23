<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
 
class Cita extends Model
{
    use HasFactory;

    protected $primaryKey = 'idCitas';
    public $incrementing = true; // Asumiendo que deseas que el ID sea auto-incremental.
    protected $keyType = 'int'; // El tipo de la llave primaria es un entero.

    protected $fillable = [
        'idPacientes',
        'Nombre_Paciente',
        'Genero',
        'Celular',
        'Correo',
        'Fecha_Cita',
        'Doctor_Consultor',
        'Diagnostico',
        'Tratamiento',
        'Notas',
    ];

    /**
     * Relación con el modelo Paciente.
     * Asumiendo que una cita pertenece a un paciente.
     */
    public function paciente()
    {
        return $this->belongsTo(Paciente::class, 'idPacientes', 'idPacientes');
    }
}
