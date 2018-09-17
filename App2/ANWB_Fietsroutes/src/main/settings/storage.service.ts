import { Injectable } from "@angular/core";
import { NativeStorage } from "@ionic-native/native-storage";

@Injectable()
export class StorageService {

    constructor(public nativeStorage: NativeStorage) {
    }

}
