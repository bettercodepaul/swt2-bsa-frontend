import {SESSION_STORAGE, StorageService} from 'angular-webstorage-service';
import {Inject, Injectable} from '@angular/core';

const STORAGE_KEY_PREFIX = 'bogenliga_';

@Injectable({
  providedIn: 'root'
})
export class SessionStorageDataProvider {

  constructor(@Inject(SESSION_STORAGE) private storage: StorageService) {

  }

  public set(key: string, value: string): void {
    this.storage.set(STORAGE_KEY_PREFIX + key, value);
  }

  public get(key: string): string {
    return this.storage.get(STORAGE_KEY_PREFIX + key);
  }

  public remove(key: string): void {
    this.storage.remove(STORAGE_KEY_PREFIX + key);
  }
}
