import { Injectable} from "@angular/core";
import { Geolocation } from '@ionic-native/geolocation';
import { Http } from "@angular/http";

import {ToastController, AlertController} from 'ionic-angular';
import 'rxjs/add/operator/map';

import { AudioService } from "./audio.service"
import { WaypointService } from "../waypoint/waypoint.service";
import { VibrationService } from "./vibration.service";
import { ConfigurationService } from "../main/settings/configuration.service";

@Injectable()
export class LocationService {
  lat: number;
  long: number;
  lastTimestamp: number;
  watch: any;
  locationData: any;
  startLocation: {
    lat: number,
    lng: number
  };
  routeFinished: boolean = false;

  constructor(private geolocation: Geolocation,
              public http: Http,
              public toastCtrl: ToastController,
              public alertCtrl: AlertController,
              private waypointService: WaypointService,
              private audioService: AudioService,
              private vibrationService: VibrationService,
              private configurationService: ConfigurationService) {

    this.loadLocations();
  }

  public watchLocation() {
    var watchOptions = {
      frequency : 1000,
      timeout : 60*60*1000,
      enableHighAccuracy: true
    };

    this.watch = this.geolocation.watchPosition(watchOptions);
    this.watch.subscribe((data) => {
      if(data.coords != undefined) {
        this.lat = data.coords.latitude;
        this.long = data.coords.longitude;
        this.lastTimestamp = data.timestamp;
        this.refreshLocationDistances();
      }
    });
  }

  public stopWatchingLocation() {
    navigator.geolocation.clearWatch(this.watch)
    this.watch = undefined;
  }

  public loadLocations() {
    this.routeFinished = false;

    console.log("Loading locations..")
    return new Promise(resolve => {

      this.http.get('assets/locations.json').map(res => res.json()).subscribe(data => {
        this.locationData = this.applyHaversine(data.locations);

        let filteredLocations = [];
        for(let waypoint of this.waypointService.waypoints) {
          for(let location of this.locationData) {
            if(waypoint != undefined) {
              if (location.id == waypoint.id) {
                location.passed = false;
                filteredLocations.push(location);
              }
            }
          }
        }

         this.locationData = filteredLocations;

        resolve(this.locationData);
      });

    });
  }

  private refreshLocationDistances() {
    if(this.locationData == undefined) {
      return;
    }

    this.locationData = this.applyHaversine(this.locationData);
    this.checkIfStandingOnWaypoint();
  }

  public getFirstWaypoint() {
    return this.locationData[0];
  }

  public getLastWaypoint() {
    return this.locationData[this.locationData.length - 1];
  }

  public getCurrentWaypoint() {
    for (let location in this.locationData) {
      if(this.locationData[location].passed == false) {
        return this.locationData[location];
      }
    }
  }

  public getNextWaypoint() {
    for (let location in this.locationData) {
      if(this.locationData[location].passed == false) {
        if (this.locationData[location] != undefined)
          return this.locationData[location];
        else
          return undefined;
      }
    }
  }

  public getNextWayPointWithOffset(offset: number) {
    for (let location in this.locationData) {
      if(this.locationData[location].passed == false) {
        let locationIndex = +location;
        if (this.locationData[locationIndex + offset] != undefined)
          return this.locationData[locationIndex + offset];
        else
          return undefined;
      }
    }
  }

  public setAllWaypointsNotPassed() {
    for (let location in this.locationData) {
      this.locationData[location].passed = false
    }
  }

  private checkIfStandingOnWaypoint() {
    for (let location in this.locationData) {
      if(this.locationData[location].passed === false) {
        if(this.locationData[location].id == this.getNextWaypoint().id) {
          if (this.locationData[location].distance <= 0.05) {
            this.locationData[location].passed = true;
            this.presentWaypointCompletionToast(this.locationData[location].title, this.locationData[location].distance);

            if(this.configurationService.soundOn)
              this.audioService.playSong();

            if(this.configurationService.vibrationOn)
              this.vibrationService.vibrate();

            this.checkIfAllWaypointsArePassed();
          }
        }
      }
    }
  }

  private checkIfAllWaypointsArePassed() {
    let allWaypointsPassed = true;
    for (let location in this.locationData) {
      if(this.locationData[location].passed == false) {
        allWaypointsPassed = false;
      }
    }

    if(allWaypointsPassed == true) {
      console.log("Route Finished");
      this.routeFinished = true;

      let alert = this.alertCtrl.create({
        title: 'Route afgerond!',
        subTitle: `<p>Je hebt de route met succes afgerond, goed gedaan!</p> <p>Als je aan een nieuwe route wilt beginnen, klik rechtsboven op het plusteken.</p>`,
        buttons: ['OK']
      });
      alert.present();
    }
  }

  public calculateTotalDistance() {
    let totalDistance = 0.0;

    for (let location in this.locationData) {
      let locationIndex = +location;
      let location1 = {
        lat: this.locationData[locationIndex].latitude,
        lng: this.locationData[locationIndex].longitude
      };

      if(locationIndex == 0) {
        totalDistance += this.getDistanceBetweenPoints(this.startLocation, location1, 'km')
      } else {
        if(this.locationData[locationIndex-1] != undefined) {
          let location2 = {
            lat: this.locationData[locationIndex-1].latitude,
            lng: this.locationData[locationIndex-1].longitude
          };

          totalDistance += this.getDistanceBetweenPoints(location1, location2, 'km')
        }
      }
    }

    console.log("Total distance: ", totalDistance.toFixed(2), "km");
    return totalDistance.toFixed(2);
  }

  public calculateCurrentDistanceTravelled(): string {
    let currentDistance = 0.0;

    if(this.startLocation == undefined) {
      return 0.0.toFixed(2);
    }

    for (let location in this.locationData) {
      let locationIndex = +location;

      if(this.locationData[locationIndex].passed == false) {
        if(this.locationData[locationIndex-1] == undefined) {
          break;
        }

        if(this.locationData[locationIndex-1].passed == true) {
          let currentLocation = {
            lat: this.lat,
            lng: this.long
          };

          let location2 = {
            lat: this.locationData[locationIndex-1].latitude,
            lng: this.locationData[locationIndex-1].longitude
          };

          return (currentDistance += this.getDistanceBetweenPoints(currentLocation, location2, 'km')).toFixed(2)
        }
      }

      let location1 = {
        lat: this.locationData[locationIndex].latitude,
        lng: this.locationData[locationIndex].longitude
      };

      if(locationIndex == 0) {
        currentDistance += this.getDistanceBetweenPoints(this.startLocation, location1, 'km')
      } else {
        if(this.locationData[locationIndex-1] != undefined) {
          let location2 = {
            lat: this.locationData[locationIndex-1].latitude,
            lng: this.locationData[locationIndex-1].longitude
          };

          currentDistance += this.getDistanceBetweenPoints(location1, location2, 'km')
        }
      }
    }

    return currentDistance.toFixed(2);
  }

  private presentWaypointCompletionToast(title: string, distance: number) {
    console.log('Completed waypoint ' + title + '! (distance: ' + distance + ' km)');
    let toast = this.toastCtrl.create({
      message: 'Completed waypoint ' + title + '!',
      duration: 8000,
      position: 'top'
    });
    toast.present();
  }

  private applyHaversine(locations) {
    let usersLocation = {
      lat: this.lat,
      lng: this.long
    };

    locations.map((location) => {
      let placeLocation = {
        lat: location.latitude,
        lng: location.longitude
      };

      location.distance = this.getDistanceBetweenPoints(
        usersLocation,
        placeLocation,
        'km'
      ).toFixed(2);
    });

    return locations;
  }

  private getDistanceBetweenPoints(start, end, units) {
    let earthRadius = {
      miles: 3958.8,
      km: 6371
    };

    let R = earthRadius[units || 'miles'];
    let lat1 = start.lat;
    let lon1 = start.lng;
    let lat2 = end.lat;
    let lon2 = end.lng;

    let dLat = this.toRad((lat2 - lat1));
    let dLon = this.toRad((lon2 - lon1));
    let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let d = R * c;

    return d;

  }

  private toRad(x) {
    return x * Math.PI / 180;
  }

  public setStartLocation() {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.startLocation = {
        lat: resp.coords.latitude,
        lng: resp.coords.longitude
      };
      this.calculateTotalDistance();
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }
}
