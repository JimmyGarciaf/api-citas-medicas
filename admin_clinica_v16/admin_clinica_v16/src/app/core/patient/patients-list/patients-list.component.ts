import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatTableDataSource } from "@angular/material/table";
import { Sort } from '@angular/material/sort';
import { environment } from 'src/environments/environment.development'; // Importar el archivo de entorno
import { routes } from 'src/app/shared/routes/routes';
import { pageSelection, apiResultFormat, patientlist } from 'src/app/shared/models/models';

@Component({
  selector: 'app-patients-list',
  templateUrl: './patients-list.component.html',
  styleUrls: ['./patients-list.component.scss']
})
export class PatientsListComponent implements OnInit {
  public routes = routes;
  // Define el tipo explícito de MatTableDataSource para evitar el tipo 'never'
  public dataSource: MatTableDataSource<patientlist> = new MatTableDataSource<patientlist>([]);

  public showFilter = false;
  public searchDataValue = '';
  public lastIndex = 0;
  public pageSize = 100;
  public totalData = 0;
  public skip = 0;
  public limit: number = this.pageSize;
  public pageIndex = 0;
  public serialNumberArray: Array<number> = [];
  public currentPage = 1;
  public pageNumberArray: Array<number> = [];
  public pageSelection: Array<pageSelection> = [];
  public totalPages = 0;

  patients: patientlist[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getPatients();

     // Personalizar el filtro para buscar en varias columnas
     this.dataSource.filterPredicate = (data: patientlist, filter: string): boolean => {
      const searchTerm = filter.trim().toLowerCase();
      return data.Nombre_Paciente.toLowerCase().includes(searchTerm) || 
             data.Celular.toLowerCase().includes(searchTerm) || 
             data.Correo.toLowerCase().includes(searchTerm);  // Agrega las columnas que quieras filtrar
    };
  }

  getPatients(): void {
    this.http.get(environment.URL_SERVICIOS+environment.GET_PACIENTES)
      .subscribe((data: any) => {
        this.patients = data;
        this.dataSource.data = this.patients;  // Asignar los datos obtenidos
        console.log(this.patients);
        this.calculateTotalPages(this.patients.length, this.pageSize);
      }, (error) => {
        console.error('Error fetching patients:', error);
      });
  }

  // Función para realizar la búsqueda
  public searchData(value: string): void {
    this.dataSource.filter = value.trim().toLowerCase();  // Aplicar el filtro
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();  // Resetea la paginación al filtrar
    }
  }

  public sortData(sort: Sort) {
    const data = this.dataSource.data.slice();

    if (!sort.active || sort.direction === '') {
      this.dataSource.data = data;
    } else {
      this.dataSource.data = data.sort((a, b) => {
        const aValue = a[sort.active as keyof patientlist];
        const bValue = b[sort.active as keyof patientlist];
        return (aValue < bValue ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
      });
    }
  }

  public getMoreData(event: string): void {
    if (event === 'next') {
      this.currentPage++;
      this.pageIndex = this.currentPage - 1;
      this.limit += this.pageSize;
      this.skip = this.pageSize * this.pageIndex;
      this.getPatients();
    } else if (event === 'previous') {
      this.currentPage--;
      this.pageIndex = this.currentPage - 1;
      this.limit -= this.pageSize;
      this.skip = this.pageSize * this.pageIndex;
      this.getPatients();
    }
  }

  public moveToPage(pageNumber: number): void {
    this.currentPage = pageNumber;
    this.skip = this.pageSelection[pageNumber - 1].skip;
    this.limit = this.pageSelection[pageNumber - 1].limit;
    this.getPatients();
  }

  public PageSize(): void {
    this.pageSelection = [];
    this.limit = this.pageSize;
    this.skip = 0;
    this.currentPage = 1;
    this.getPatients();
  }

  private calculateTotalPages(totalData: number, pageSize: number): void {
    this.pageNumberArray = [];
    this.totalPages = Math.ceil(totalData / pageSize);
    for (let i = 1; i <= this.totalPages; i++) {
      const limit = pageSize * i;
      const skip = limit - pageSize;
      this.pageNumberArray.push(i);
      this.pageSelection.push({ skip: skip, limit: limit });
    }
  }

  // Nueva función para obtener el menor de dos números
  public getMinValue(value1: number, value2: number): number {
    return Math.min(value1, value2);
  }
}