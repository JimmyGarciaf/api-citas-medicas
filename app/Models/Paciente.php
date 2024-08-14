<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Paciente extends Model
{
    use HasFactory;

    protected $primaryKey = 'idPacientes';
    public $incrementing = false;
    protected $keyType = 'string';
    
    protected $fillable = [
        'idPacientes',
        'Nombre_Paciente',
        'Departamento',
        'Celular',
        'Correo',
        'Genero',
    ];
    
}