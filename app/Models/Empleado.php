<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Empleado extends Model
{
    protected $connection = 'sqlsrv'; // Conexión externa
    protected $table = 'exp.emp_empleados_v'; // Nombre de la tabla

    protected $primaryKey = 'emp_codigo'; // Columna de clave primaria
    public $incrementing = false;
    protected $keyType = 'string'; // Tipo de la clave primaria

    protected $fillable = [
        'emp_codigo',
        'exp_codigo_alternativo',
        'exp_nombres_apellidos',
        'exp_sexo',
        'plz_nombre',
    ];
}
