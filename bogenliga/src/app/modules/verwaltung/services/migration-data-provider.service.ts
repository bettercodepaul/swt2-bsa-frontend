import {HttpErrorResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {
  BogenligaResponse,
  DataProviderService, DataTransferObject,
  RequestResult,
  RestClient,
  UriBuilder,
  VersionedDataTransferObject
} from '../../shared/data-provider';
import {CurrentUserService} from '../../shared/services/current-user';
import {fromCountPayload, fromPayload, fromPayloadArray} from '../mapper/trigger-mapper';
import {TriggerDO} from '../types/trigger-do.class';
import {db} from '@shared/data-provider/offlinedb/offlinedb';
import {OnOfflineService} from '@shared/services';
import {TriggerCountDO} from '@verwaltung/types/trigger-count-do-class';

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

  public startMigration() {
    this.restClient.GET(new UriBuilder().fromPath(this.getUrl()).path('buttonSync').build())
  }

  public getEntireDataCount(): Promise<BogenligaResponse<TriggerCountDO>> {

    return new Promise((resolve, reject) => {
      this.restClient.GET<DataTransferObject>(new UriBuilder().fromPath(this.getUrl()).path('firstCount').build())
          .then((data: DataTransferObject[]) => {
            resolve({result: RequestResult.SUCCESS, payload: fromCountPayload(data)});
          }, (error: HttpErrorResponse) => {

            if (error.status === 0) {
              reject({result: RequestResult.CONNECTION_PROBLEM});
            } else {
              reject({result: RequestResult.FAILURE});
            }
          });
    });
  }

  public getSucceededDataCount():Promise<BogenligaResponse<TriggerCountDO>>{

    return new Promise((resolve, reject) => {
      this.restClient.GET<DataTransferObject>(new UriBuilder().fromPath(this.getUrl()).path('afterTime').build())
          .then((data: DataTransferObject) => {
            resolve({result: RequestResult.SUCCESS, payload: fromCountPayload(data)});
          }, (error: HttpErrorResponse) => {

            if (error.status === 0) {
              reject({result: RequestResult.CONNECTION_PROBLEM});
            } else {
              reject({result: RequestResult.FAILURE});
            }
          });
    });
  }

}
