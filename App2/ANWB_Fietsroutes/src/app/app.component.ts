import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { Slides } from '../main/slides/slides.component';
import { TabsPage } from "../main/tabs/tabs.component";

import { ConfigurationService } from "../main/settings/configuration.service";
import {StorageService} from "../main/settings/storage.service";
import {TrainingHistoryService} from "../training-scheme/training-history.service";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  // rootPage:any = TabsPage;
  rootPage:any = this.getRootPage();

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private configurationService: ConfigurationService, private storageService: StorageService, private trainingHistoryService: TrainingHistoryService) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      this.loadConfigurationFromStorage();
      this.loadTeamHistoryFromStorage();
    });
  }

  private loadConfigurationFromStorage() {
    this.storageService.nativeStorage.getItem("vibrationSetting")
      .then(
        data => this.configurationService.vibrationOn = data,
        error => console.log(error)
      );

    this.storageService.nativeStorage.getItem("slidesSetting")
      .then(
        data => this.configurationService.slidesOn = data,
        error => console.log(error)
      );

    this.storageService.nativeStorage.getItem("soundSetting")
      .then(
        data => this.configurationService.soundOn = data,
        error => console.log(error)
      );
  }

  private loadTeamHistoryFromStorage() {
    this.storageService.nativeStorage.getItem("trainingHistory")
      .then(
        data => this.trainingHistoryService.setArray(data),
        error => console.log(error)
      );
  }

  private getRootPage() {
    if(this.configurationService.slidesOn) {
      return Slides;
    }

    return TabsPage;
  }
}

