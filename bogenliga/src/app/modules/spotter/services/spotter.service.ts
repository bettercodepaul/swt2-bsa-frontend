import { HttpErrorResponse } from '@angular/common/http';
import { SpotterResult } from './../types/spotter-result.enum';
import { Play } from './../types/play';
import { Injectable } from '@angular/core';
import { DataProviderService, RestClient, UriBuilder } from './../../../modules/shared/';

@Injectable({
  providedIn: 'root'
})
export class SpotterService {
  // export class SpotterService extends DataProviderService
  // extension is disabled, because the spotter service is not yet implemented and we can't get a connection


  serviceSubUrl: 'v1/spotter';

  constructor(private restClient: RestClient) {
  }

  public sendPlay(play: Play): Promise<void> {
    return new Promise((resolve, reject) => {
      resolve(); // Temporary deactivation to demonstrate spotter interface
      /*
      this.restClient.POST<void>(new UriBuilder().fromPath(this.getUrl()).build(), play)
        .then(() => {
          resolve();
        }, (error: HttpErrorResponse) => {
          if (error.error === 401) {
            reject(SpotterResult.UNAUTHORIZED);
          } else {
            reject(SpotterResult.FAILURE);
          }
        });
        */
    });
  }

  public nextSet(): Promise<void> {
    return new Promise((resolve, reject) => {
      resolve(); // Temporary deactivation to demonstrate spotter interface
      /*
      this.restClient.GET<void>(new UriBuilder().fromPath(this.getUrl()).path('/set').build())
        .then(() => {
          resolve();
        }, (error: HttpErrorResponse) => {
          if (error.error === 401) {
            reject(SpotterResult.UNAUTHORIZED);
          } else {
            reject(SpotterResult.FAILURE);
          }
        });
        */
    });
  }

  public nextMatch(): Promise<string> {
    return new Promise((resolve, reject) => {
      resolve('Next Team'); // Temporary deactivation to demonstrate spotter interface
      /*
      this.restClient.GET<string>(new UriBuilder().fromPath(this.getUrl()).path('match').build())
        .then((result: string) => {
          resolve(result);
        }, (error: HttpErrorResponse) => {
          if (error.error === 401) {
            reject(SpotterResult.UNAUTHORIZED);
          } else {
            reject(SpotterResult.FAILURE);
          }
        });
        */
    });
  }

}
