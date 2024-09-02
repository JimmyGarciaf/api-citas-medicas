<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Http\Controllers\Pacientes;

class TransferData extends Command
{
    protected $signature = 'data:transfer';
    protected $description = 'Transferir datos de empleados a pacientes';

    public function __construct()
    {
        parent::__construct();
    }

    public function handle()
{
    $pacientesController = new Pacientes();
    $response = $pacientesController->transferData();
    
    if ($response->status() === 200) {
        $this->info('Datos transferidos exitosamente.');
    } else {
        $this->error('Algunos datos no pudieron ser transferidos.');
        
        $responseData = $response->getData();

        // Log de la respuesta completa para mayor detalle
        $this->line('Respuesta completa: ' . json_encode($responseData, JSON_PRETTY_PRINT));
        
        // Verificar si existe la propiedad 'errors' antes de acceder a ella
        if (isset($responseData->errors)) {
            $this->line(json_encode($responseData->errors, JSON_PRETTY_PRINT));
        } else {
            $this->line('No se encontraron detalles de errores.');
        }
    }
}
}
