import {Component} from '@angular/core';
import {mainMenuService} from "../../layout/main-menu/main-menu.service";


@Component({
  selector    : 'page-dashboard',
  templateUrl : 'app/modules/dashboard/dashboard.component.html',
  styleUrls   : ['app/modules/dashboard/dashboard.component.css']
})

export class DashboardComponent {
  constructor() {

  }
}

mainMenuService.registerButton('/', 'Dashboard');

export const route = {path : '', component : DashboardComponent};



