import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { NativeAudio } from '@ionic-native/native-audio';
import { Geolocation } from '@ionic-native/geolocation';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio';
import { Vibration } from "@ionic-native/vibration";
import { DeviceOrientation } from "@ionic-native/device-orientation";
import { NativeStorage } from "@ionic-native/native-storage";

import { MyApp } from './app.component';
import { RouteDetail } from '../route/route-detail/route-detail.component';
import { WaypointAdderPage } from '../waypoint/waypoint-adder/waypoint-adder.component';
import { TabsPage } from '../main/tabs/tabs.component';
import { SettingsPage } from '../main/settings/settings.component';
import { TrainingDetailPage } from '../training-scheme/training-detail/training-detail.component'
import { TrainingPage } from '../training-scheme/training/training.component'
import { Slides } from '../main/slides/slides.component'
import { Timer } from "../route/route-timer/route-timer.component";

import { AudioService } from '../route/audio.service';
import { WaypointService } from "../waypoint/waypoint.service";
import { LocationService } from "../route/location.service";
import { TrainingHistoryService } from '../training-scheme/training-history.service';
import { ConfigurationService } from "../main/settings/configuration.service";
import { StorageService } from "../main/settings/storage.service";
import { VibrationService } from "../route/vibration.service";

@NgModule({
  declarations: [
    MyApp,
    RouteDetail,
    Timer,
    TabsPage,
    SettingsPage,
    TrainingDetailPage,
    WaypointAdderPage,
    TrainingPage,
    Slides
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    RouteDetail,
    TabsPage,
    SettingsPage,
    WaypointAdderPage,
    TrainingDetailPage,
    TrainingPage,
    Slides
  ],
  providers: [
    StatusBar,
    SplashScreen,
    NativeAudio,
    Geolocation,
    WaypointService,
    LocationService,
    AudioService,
    VibrationService,
    Vibration,
    StorageService,
    NativeStorage,
    ConfigurationService,
    DeviceOrientation,
    FingerprintAIO,
    TrainingHistoryService,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
  ]
})
export class AppModule {}
