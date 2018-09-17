import { Injectable } from "@angular/core";
import { Vibration } from '@ionic-native/vibration';
import { Platform } from "ionic-angular";

@Injectable()
export class VibrationService {
    private iOSDevice = false;
    private vibrationDelay: number = 1000;
    private vibrationDuration: number = 1000;

    constructor(private vibration: Vibration, private platform: Platform) {
      platform.ready().then(() => {
        if (this.platform.is('ios')) {
          this.iOSDevice = true;
        }
      });
    }

    public vibrate() {
      if(this.iOSDevice) {
        // Duration is ignored in iOS:
        this.vibration.vibrate(this.vibrationDuration);

        setTimeout(() => {
          this.vibration.vibrate(this.vibrationDuration);
        }, this.vibrationDelay);

        // Vibrate, pause one second, vibrate
      } else {
        // If device is Android/Windows:
        this.vibration.vibrate([this.vibrationDuration, this.vibrationDelay, this.vibrationDuration]); // Vibrate one second, pause one second, vibrate one second
      }
    }
}
