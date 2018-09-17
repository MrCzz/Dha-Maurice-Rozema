import { Injectable } from "@angular/core";

@Injectable()
export class WaypointService {
    waypoints: Array<{ id: string, passed: boolean }> = [
        { id: '', passed: false },
    ];

    constructor() {
    }

    addWaypoint(id: string, passed: boolean) {
        this.waypoints.push({ id, passed });
    }

    deleteWayPoint(index: number) {
        this.waypoints.splice(index, 1);
    }

    printWayPoint() {
        for (let i = 0; i < this.waypoints.length; i++) {
            console.log("ArrayIDX: ", this.waypoints[i].id);
        }
    }

    setWaypointArray(anArray: Array<{ id: string, passed: boolean }>) {
        for (let i = 0; i < anArray.length; i++) {
            if (anArray[i].id == '') {
                anArray.splice(i, 1);
                continue;
            }
        }
        this.waypoints = anArray;
    }
}
