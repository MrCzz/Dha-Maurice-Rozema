import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { LocationService } from "../location.service";
import { WaypointAdderPage } from "../../waypoint/waypoint-adder/waypoint-adder.component";

@Component({
  selector: 'page-home',
  templateUrl: 'route-detail.component.html'
})
export class RouteDetail {
  private waypointPage = WaypointAdderPage;

  private time: any = 0;
  private previousTime: any = 0;
  private isCycling: Boolean = false;ßß

  constructor(public navCtrl: NavController,
    private locationService: LocationService) {
  }

  ngOnInit() {

  }

  ngOnDestroy() {
  }

  private updateTime(time) {
    this.time = time;
  }

  private updatePreviousTime(previousTime) {
    this.previousTime = previousTime;
  }

  private updateIsCycling(isCycling) {
    this.isCycling = isCycling;
  }

  private secondsToHms(d: number) {
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    return ('0' + h).slice(-2) + ":" + ('0' + m).slice(-2) + ":" + ('0' + s).slice(-2);
  }

}
