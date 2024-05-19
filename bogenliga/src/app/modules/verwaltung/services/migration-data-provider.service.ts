import {HttpErrorResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {
  BogenligaResponse,
  DataProviderService,
  RequestResult,
  RestClient,
  UriBuilder,
  VersionedDataTransferObject
} from '../../shared/data-provider';
import {CurrentUserService} from '../../shared/services/current-user';
import {fromPayload, fromPayloadArray} from '../mapper/trigger-mapper';
import {TriggerDO} from '../types/trigger-do.class';
import {db} from '@shared/data-provider/offlinedb/offlinedb';
import {OnOfflineService} from '@shared/services';


@Injectable({
  providedIn: 'root'
})
export class MigrationProviderService extends DataProviderService {

  serviceSubUrl = 'v1/trigger';


  constructor(private restClient: RestClient, private currentUserService: CurrentUserService, private onOfflineService: OnOfflineService) {
    super();
  }

  public findAll(): Promise<BogenligaResponse<TriggerDO[]>> {
    // return promise
    // sign in success -> resolve promise
    // sign in failure -> reject promise with result
    return new Promise((resolve, reject) => {
      this.restClient.GET<Array<VersionedDataTransferObject>>(this.getUrl())
          .then((data: VersionedDataTransferObject[]) => {
            resolve({result: RequestResult.SUCCESS, payload: fromPayloadArray(data)});
          }, (error: HttpErrorResponse) => {

            if (error.status === 0) {
              reject({result: RequestResult.CONNECTION_PROBLEM});
            } else {
              reject({result: RequestResult.FAILURE});
            }
          });
    });
  }

  public findSuccessed(offsetMultiplicator:number,queryPageLimit: number, timestamp:string): Promise<BogenligaResponse<TriggerDO[]>> {
    // return promise
    // sign in success -> resolve promise
    // sign in failure -> reject promise with result
    const dateInterval = this.changeTimestampToInterval(timestamp);
    return new Promise((resolve, reject) => {
      this.restClient.GET<Array<VersionedDataTransferObject>>(new UriBuilder().fromPath(this.getUrl()).path('findSuccessed?offsetMultiplicator=' + offsetMultiplicator.toString()
        + '&queryPageLimit=' + queryPageLimit.toString() + '&dateInterval=' + dateInterval.toString()).build())
          .then((data: VersionedDataTransferObject[]) => {
            resolve({result: RequestResult.SUCCESS, payload: fromPayloadArray(data)});
          }, (error: HttpErrorResponse) => {

            if (error.status === 0) {
              reject({result: RequestResult.CONNECTION_PROBLEM});
            } else {
              reject({result: RequestResult.FAILURE});
            }
          });
    });
  }
  public findAllWithPages(offsetMultiplicator:number,queryPageLimit: number, timestamp:string): Promise<BogenligaResponse<TriggerDO[]>> {
    // return promise
    // sign in success -> resolve promise
    // sign in failure -> reject promise with result
    const dateInterval = this.changeTimestampToInterval(timestamp);
    return new Promise((resolve, reject) => {
      this.restClient.GET<Array<VersionedDataTransferObject>>(new UriBuilder().fromPath(this.getUrl()).path('findAllWithPages?offsetMultiplicator=' + offsetMultiplicator.toString() + '&queryPageLimit=' + queryPageLimit.toString() + '&dateInterval=' + dateInterval.toString()).build()
      )
          .then((data: VersionedDataTransferObject[]) => {
            resolve({result: RequestResult.SUCCESS, payload: fromPayloadArray(data)});
          }, (error: HttpErrorResponse) => {

            if (error.status === 0) {
              reject({result: RequestResult.CONNECTION_PROBLEM});
            } else {
              reject({result: RequestResult.FAILURE});
            }
          });
    });
  }
  public findErrors(offsetMultiplicator:number,queryPageLimit: number, timestamp:string): Promise<BogenligaResponse<TriggerDO[]>> {
    // return promise
    // sign in success -> resolve promise
    // sign in failure -> reject promise with result
    const dateInterval = this.changeTimestampToInterval(timestamp);
    return new Promise((resolve, reject) => {
      this.restClient.GET<Array<VersionedDataTransferObject>>(new UriBuilder().fromPath(this.getUrl()).path('findErrors?offsetMultiplicator=' + offsetMultiplicator.toString() + '&queryPageLimit=' + queryPageLimit.toString() + '&dateInterval=' + dateInterval.toString()).build()
      )
          .then((data: VersionedDataTransferObject[]) => {
            resolve({result: RequestResult.SUCCESS, payload: fromPayloadArray(data)});
          }, (error: HttpErrorResponse) => {

            if (error.status === 0) {
              reject({result: RequestResult.CONNECTION_PROBLEM});
            } else {
              reject({result: RequestResult.FAILURE});
            }
          });
    });
  }
  public findInProgress(offsetMultiplicator:number,queryPageLimit: number, timestamp:string): Promise<BogenligaResponse<TriggerDO[]>> {
    // return promise
    // sign in success -> resolve promise
    // sign in failure -> reject promise with result
    const dateInterval = this.changeTimestampToInterval(timestamp);
    return new Promise((resolve, reject) => {
      this.restClient.GET<Array<VersionedDataTransferObject>>(new UriBuilder().fromPath(this.getUrl()).path('findInProgress?offsetMultiplicator=' + offsetMultiplicator.toString() + '&queryPageLimit=' + queryPageLimit.toString() + '&dateInterval=' + dateInterval.toString()).build())
          .then((data: VersionedDataTransferObject[]) => {
            resolve({result: RequestResult.SUCCESS, payload: fromPayloadArray(data)});
          }, (error: HttpErrorResponse) => {

            if (error.status === 0) {
              reject({result: RequestResult.CONNECTION_PROBLEM});
            } else {
              reject({result: RequestResult.FAILURE});
            }
          });
    });
  }
  public findNews(offsetMultiplicator:number,queryPageLimit: number, timestamp:string): Promise<BogenligaResponse<TriggerDO[]>> {
    // return promise
    // sign in success -> resolve promise
    // sign in failure -> reject promise with result
    const dateInterval = this.changeTimestampToInterval(timestamp);
    return new Promise((resolve, reject) => {
      this.restClient.GET<Array<VersionedDataTransferObject>>(new UriBuilder().fromPath(this.getUrl()).path('findNews?offsetMultiplicator=' + offsetMultiplicator.toString() + '&queryPageLimit=' + queryPageLimit.toString() + '&dateInterval=' + dateInterval.toString()).build())
          .then((data: VersionedDataTransferObject[]) => {
            resolve({result: RequestResult.SUCCESS, payload: fromPayloadArray(data)});
          }, (error: HttpErrorResponse) => {

            if (error.status === 0) {
              reject({result: RequestResult.CONNECTION_PROBLEM});
            } else {
              reject({result: RequestResult.FAILURE});
            }
          });
    });
  }
  public deleteEntries(status: string,timestamp:string):Promise<BogenligaResponse<TriggerDO[]>> {
    // return promise
    // sign in success -> resolve promise
    // sign in failure -> reject promise with result
    const dateInterval = this.changeTimestampToInterval(timestamp);
    return new Promise((resolve, reject) => {
      this.restClient.DELETE<any>(new UriBuilder().fromPath(this.getUrl()).path('deleteEntries?status=' + status + '&dateInterval=' + dateInterval).build())
          .then(() => {
            resolve({ result: RequestResult.SUCCESS});
          })
          .catch((error: HttpErrorResponse) => {
            if (error.status === 0) {
              reject({ result: RequestResult.CONNECTION_PROBLEM });
            } else {
              reject({ result: RequestResult.FAILURE });
            }
          });
    });
  }
  public startMigration() {
    this.restClient.GET(new UriBuilder().fromPath(this.getUrl()).path('buttonSync').build())
  }
  private changeTimestampToInterval(timestamp:string):string{
    let interval:string;
    switch (timestamp){
      case 'alle':
        interval = "20 YEAR"
        break;
      case 'letzter Monat':
        interval = "1 MONTH"
        break;
      case 'letzten drei Monate':
        interval = "3 MONTH"
        break;
      case 'letzten sechs Monate':
        interval = "6 MONTH"
        break;
      case 'im letzten Jahr':
        interval = "12 MONTH"
        break;
    }
    return interval;
  }
}
