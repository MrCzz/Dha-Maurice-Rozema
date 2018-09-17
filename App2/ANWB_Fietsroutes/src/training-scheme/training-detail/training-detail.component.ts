import { Component } from '@angular/core';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio';
import { NavController, NavParams } from 'ionic-angular';

import { TrainingHistoryService } from '../training-history.service'
import { TrainingPage } from '../training/training.component'

export enum FINGERPRINTSTATUS {
  NOT_SET = 0,
  NOT_AVAILABLE,
  AVAILABLE
}

@Component({
  selector: 'page-training-scheme',
  templateUrl: 'training-detail.component.html'
})
export class TrainingDetailPage {
  isAuthenticated: boolean = false;
  isAvailable: boolean = false;
  isDelayPassed: boolean = false;
  public FINGERPRINTSTATUS = FINGERPRINTSTATUS;
  mobileHasFingerprintSensor: FINGERPRINTSTATUS = FINGERPRINTSTATUS.NOT_SET;

  constructor(public navCtrl: NavController, public navParams: NavParams, private faio: FingerprintAIO, private historyService: TrainingHistoryService) {
  }

  authenticate() {
    this.faio.show({
      clientId: 'Fingerprint-Demo',
      clientSecret: 'password', //Only necessary for Android
      disableBackup: true,  //Only for Android(optional)
      localizedFallbackTitle: 'Use Pin', //Only for iOS
      localizedReason: 'Please authenticate' //Only for iOS
    })
      .then((result: any) => {
        this.isAuthenticated = true;
        console.log(result);
      })
      .catch((error: any) => {
        this.isAuthenticated = false;
        console.log(error);
        this.navCtrl.parent.select(0);
      });
  }

  available() {
    this.faio.isAvailable()
    .then((result: any) => {
        this.mobileHasFingerprintSensor = FINGERPRINTSTATUS.AVAILABLE;
    })
    .catch((error: any) => {
      console.log("Error: ", error);
      this.mobileHasFingerprintSensor = FINGERPRINTSTATUS.NOT_AVAILABLE;
    });
  }

  ionViewWillEnter() {
    this.isDelayPassed = false;
    this.available();
    setTimeout(()=> {
      this.isDelayPassed = true;
      if(this.mobileHasFingerprintSensor == FINGERPRINTSTATUS.AVAILABLE) {
        if(!this.isAuthenticated) {
          this.authenticate();
        }
      }
    } , 2000);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TrainingSchemePage');
  }

  onSelect(index: number) {
    console.log("index: ", index);
    let history = this.historyService.getTraining(index);

    this.navCtrl.push(TrainingPage, {
      firstPassed: history
    });
  }

}
