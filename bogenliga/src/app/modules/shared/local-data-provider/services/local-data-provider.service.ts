import {Injectable} from '@angular/core';
import {isNullOrUndefined} from '@shared/functions';
import {isStorageAvailable} from 'angular-webstorage-service';
import {LocalStorageDataProvider} from './data-sources/local-storage-data-provider.class';
import {SessionStorageDataProvider} from './data-sources/session-storage-data-provider.class';

/**
 * I provider data from the local user client and abstract the data source.
 *
 * The data sources can be
 * - session storage
 * - local storage
 * - in memory storage (fallback)
 *
 * @see https://www.npmjs.com/package/angular-webstorage-service
 */
@Injectable({
  providedIn: 'root'
})
export class LocalDataProviderService {

  constructor(
    private localStorageDataProvider: LocalStorageDataProvider,
    private sessionStorageDataProvider: SessionStorageDataProvider) {
  }

  /**
   * Persists key-value pair in session storage.
   *
   * Data will be lost after closing the browser tab.
   *
   * @param key
   * @param value
   */
  public setSessionScoped(key: string, value: string): boolean {
    const sessionStorageAvailable: boolean = isStorageAvailable(sessionStorage);

    if (sessionStorageAvailable) {
      this.sessionStorageDataProvider.set(key, value);
      return true;
    } else {
      return false;
    }
  }

  /**
   * Persists key-value pair in local storage.
   *
   * Data remain in browser (similar to cookies)
   *
   * @param key
   * @param value
   */
  public setPermanently(key: string, value: string): boolean {
    const localStorageAvailable: boolean = isStorageAvailable(localStorage);

    if (localStorageAvailable) {
      this.localStorageDataProvider.set(key, value);
      return true;
    } else {
      return false;
    }
  }

  /**
   * Returns a key-value pair from all local data sources.
   *
   * 1. try session storage
   * 2. try local storage
   *
   * @param key
   * @return value
   */
  public get(key: string): any {
    const sessionStorageAvailable: boolean = isStorageAvailable(sessionStorage);
    const localStorageAvailable: boolean = isStorageAvailable(localStorage);

    let value = null;
    if (sessionStorageAvailable) {
      value = this.sessionStorageDataProvider.get(key);
    }

    if (isNullOrUndefined(value) && localStorageAvailable) {
      value = this.localStorageDataProvider.get(key);
    }

    return value;
  }

  /**
   * Removes a key-value pair from all local data sources
   *
   * @param key
   */
  public remove(key: string): void {
    const sessionStorageAvailable: boolean = isStorageAvailable(sessionStorage);
    const localStorageAvailable: boolean = isStorageAvailable(localStorage);

    if (sessionStorageAvailable) {
      this.sessionStorageDataProvider.remove(key);
    }

    if (localStorageAvailable) {
      this.localStorageDataProvider.remove(key);
    }
  }
}
