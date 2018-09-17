import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-training',
  templateUrl: 'training.component.html',
})
export class TrainingPage {
  history: any;
  
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.history = navParams.get("firstPassed");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TrainingPage');
  }
}
