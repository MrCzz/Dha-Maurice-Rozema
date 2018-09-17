import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { ConfigurationService } from "./configuration.service";

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.component.html'
})
export class SettingsPage {

  constructor(public navCtrl: NavController, private configurationService: ConfigurationService) {

  }

}
