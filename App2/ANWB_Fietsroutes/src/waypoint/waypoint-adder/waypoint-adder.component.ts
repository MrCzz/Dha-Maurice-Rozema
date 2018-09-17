import { Component } from '@angular/core';
import {Http} from "@angular/http";
import { NavController, NavParams, AlertController } from 'ionic-angular';

import { TabsPage } from '../../main/tabs/tabs.component'
import { WaypointService } from "../waypoint.service";
import { LocationService } from "../../route/location.service";

@Component({
  selector: 'page-waypoint-adder',
  templateUrl: 'waypoint-adder.component.html'
})
export class WaypointAdderPage {
  waypoints: Array<{id: string, passed: boolean}> = [
    {id: '', passed: false},
    {id: '', passed: false},
    {id: '', passed: false},
    {id: '', passed: false},
    {id: '', passed: false}
  ];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    private waypointService: WaypointService,
    private locationService: LocationService,
    private http: Http)
  {
  }

  ngOnInit() {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WaypointAdderPage');
  }

  addWaypoint() {
    this.waypoints.push({id: '', passed: false});
  }

  deleteWayPoint(index: number) {
    this.waypoints.splice(index, 1);
  }

  routeConfirmation() {
    if (this.validInput()) {
      this.waypointService.setWaypointArray(this.waypoints);
      this.printWayPoint();
      this.locationService.loadLocations();
      this.navCtrl.push(TabsPage);
    } else {
      this.showAlert("Ongeldige route", "Niet ieder veld is ingevuld of de app ondersteund het knooppunt nog niet. Excuus voor het ongemak.");
    }
  }

  validInput() {
    if(this.waypoints.length <= 1) {
      return false;
    }

    for(let i=0; i < this.waypoints.length; i++) {
      if (this.waypoints[i].id == '') {
        this.waypoints.splice(i, 1);
        continue;
      }

      this.checkValidWayPoint(this.waypoints[i].id).then(function(isValid) {
        if (!isValid) {
          return false;
        }
      });
    }
    return true;
  }

  checkValidWayPoint(id: string) {
    return new Promise(resolve => {
      let isValid = false;
      this.http.get('assets/locations.json').map(res => res.json()).subscribe(data => {
        for(let location of data.locations) {
          if(location.id === +id) {
            isValid = true;
            console.log(isValid);
          }
        }
      });

      resolve(isValid)
    });
  }

  showAlert(title: string, subtitle: string) {
    let alert = this.alertCtrl.create({
      title: 'Ongeldige route',
      subTitle: 'Niet ieder veld is ingevuld of de app ondersteund het knooppunt nog niet. Excuus voor het ongemak.',
      buttons: ['OK']
    });
    alert.present();
  }

  printWayPoint() {
    this.waypointService.printWayPoint();
  }
}
