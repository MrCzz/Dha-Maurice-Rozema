import { Injectable } from "@angular/core";

@Injectable()
export class AudioService {
    private audioPath: string = "assets/sounds/waypointSound.mp3";

    constructor() {
    }

    public playSong() {
        var audio = new Audio(this.audioPath);
        audio.play();
    }
}
