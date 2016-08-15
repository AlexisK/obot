import {Component} from '@angular/core';
import {mainMenuService} from "../../layout/main-menu/main-menu.service";


@Component({
  selector    : 'page-settings-modules',
  templateUrl : 'app/modules/settings/settings-modules.component.html',
  styleUrls   : ['app/modules/settings/settings-modules.component.css']
})

export class SettingsModulesComponent {
  constructor() {

  }
}

mainMenuService.registerButton('/settings/modules', 'Modules', 'Settings');
export const route = {path : 'settings/modules', component : SettingsModulesComponent};



