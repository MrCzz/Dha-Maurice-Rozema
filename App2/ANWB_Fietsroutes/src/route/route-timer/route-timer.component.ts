import {Component, EventEmitter, Input, Output} from '@angular/core';

import { AlertController } from 'ionic-angular';
import { Subscription } from "rxjs";
import { TimerObservable } from "rxjs/observable/TimerObservable";

import { LocationService } from "../location.service";
import { TrainingHistoryService } from '../../training-scheme/training-history.service';

@Component({
  selector: 'timer',
  templateUrl: 'route-timer.component.html'
})
export class Timer {
  private isCycling: Boolean = false;
  private isPaused: Boolean = false;

  private timer: any = undefined;
  private time: any = 0;
  private previousTime: number = 0;
  private subscription: Subscription;

  @Input('interval')
  private interval: number = 0;

  @Output('timeOutput')
  private timeOutput = new EventEmitter<any>();

  @Output('previousTimeOutput')
  private previousTimeOutput = new EventEmitter<any>();

  @Output('isCyclingOutput')
  private isCyclingOutput = new EventEmitter<Boolean>();


  constructor(private locationService: LocationService, private historyService: TrainingHistoryService, private alertCtrl: AlertController,) {
  }

  ngOnInit() {
    this.timer = TimerObservable.create(0, this.interval)
  }

  ngOnDestroy() {
  }

  private startStopCycling() {
    if (!this.isCycling) {
      if (this.locationService.locationData.length == 0) {
        this.showInvalidRouteAlert();
      } else {
        this.locationService.watchLocation();
        this.subscription = this.timer.subscribe(t => {
          if(this.locationService.routeFinished == false) {
            this.time = t;
            this.timeOutput.emit(this.time);
          } else {
            this.previousTime += this.time;
            this.addRecentTrainingToHistory();
            this.subscription.unsubscribe();
          }
        });

        this.locationService.setStartLocation();
      }
    } else {
      this.previousTime += this.time;
      this.subscription.unsubscribe();
      this.time = 0;
      this.timeOutput.emit(this.time);
      this.addRecentTrainingToHistory();
      this.previousTime = 0;
      this.previousTimeOutput.emit(this.previousTime);

      this.locationService.stopWatchingLocation();
      this.locationService.setAllWaypointsNotPassed();
    }

    this.isCycling = !this.isCycling;
    this.isCyclingOutput.emit(this.isCycling);
  }

  private pauseResumeCycling() {
    if (!this.isPaused) {
      this.previousTime += this.time;
      this.previousTimeOutput.emit(this.previousTime);

      this.subscription.unsubscribe();
      this.time = 0;
      this.timeOutput.emit(this.time);
    } else {
      this.subscription = this.timer.subscribe(t => {
        this.time = t;
        this.timeOutput.emit(this.time);
      });
    }

    this.isPaused = !this.isPaused;
  }

  private addRecentTrainingToHistory() {
    let id = this.historyService.getAppendID();
    let date = new Date().toISOString().split('T')[0]
    let time = this.secondsToHms(this.previousTime);
    let speed = (+this.locationService.calculateCurrentDistanceTravelled() / ((this.previousTime / 60) / 60)).toFixed(2);
    let kcal = "0";
    let startPoint = this.locationService.getFirstWaypoint().title;
    let endPoint = this.locationService.getLastWaypoint().title;
    let distance = this.locationService.calculateCurrentDistanceTravelled();
    this.historyService.addTraining(id.toString(), date, time, speed, kcal, startPoint, endPoint, distance.toString());
  }

  private showInvalidRouteAlert() {
    let alert = this.alertCtrl.create({
      title: 'Ongeldige route',
      subTitle: 'Voordat u kunt beginnen, moet er een route geselecteerd zijn.',
      buttons: ['OK']
    });
    alert.present();
  }

  private secondsToHms(d: number) {
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    return ('0' + h).slice(-2) + ":" + ('0' + m).slice(-2) + ":" + ('0' + s).slice(-2);
  }
}
