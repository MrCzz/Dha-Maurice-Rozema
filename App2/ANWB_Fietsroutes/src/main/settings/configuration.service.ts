import { Injectable } from "@angular/core";
import { StorageService } from "./storage.service";

@Injectable()
export class ConfigurationService {
    vibrationOn: boolean = true;
    slidesOn: boolean = true;
    soundOn: boolean = true;

    constructor(private storageService: StorageService) {

    }

    public updateSetting(item) {
      switch(item) {
        case "vibration":
          this.storageService.nativeStorage.setItem("vibrationSetting", this.vibrationOn);
          break;
        case "slides":
          this.storageService.nativeStorage.setItem("slidesSetting", this.slidesOn);
          break;
        case "sound":
          this.storageService.nativeStorage.setItem("soundSetting", this.soundOn);
          break;
      }
    }
}
