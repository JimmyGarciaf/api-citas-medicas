import { Component } from '@angular/core';
import { routes } from 'src/app/shared/routes/routes';
interface data {
  value: string ;
}
@Component({
  selector: 'app-add-schedule',
  templateUrl: './add-schedule.component.html',
  styleUrls: ['./add-schedule.component.scss']
})
export class AddScheduleComponent {
  public routes = routes;
  public selectedValue !: string  ;

  selectedList: data[] = [
    {value: 'Medico General'}
  ];

}
