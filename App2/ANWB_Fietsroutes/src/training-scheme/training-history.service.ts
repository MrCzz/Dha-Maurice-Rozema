import { Injectable } from "@angular/core";
import { StorageService } from "../main/settings/storage.service";

@Injectable()
export class TrainingHistoryService {
    history: Array<
      {
        id: string,
        date: string,
        time: string,
        speed: string,
        kcal: string,
        startPoint: string,
        endPoint: string,
        distance: string
      }> = [];

    constructor(private storageService: StorageService) {
    }

    public addTraining(id: string, date: string, time: string, speed: string, kcal: string, startPoint: string, endPoint: string, distance: string) {
        this.history.push({ id, date, time, speed, kcal, startPoint, endPoint, distance });
        this.storageService.nativeStorage.setItem("trainingHistory", this.history);
    }

    public removeTraining(index: number) {
        this.history.splice(index, 1);
        this.storageService.nativeStorage.setItem("trainingHistory", this.history);
    }

    getAppendID() {
        return this.history.length + 1;
    }

    getTraining(index: number) {
        return this.history[index];
    }

    printTrainingArray() {
        for (let i = 0; i < this.history.length; i++) {
            console.log("ArrayIDX: ", this.history[i].id);
        }
    }

    setArray(anArray: Array<{ id: string, date: string, time: string, speed: string, kcal: string, startPoint: string, endPoint: string, distance: string }>) {
        this.history = anArray;
    }
}
