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
export class SyncDataProviderService extends DataProviderService {

  serviceSubUrl = 'v1/trigger';


  constructor(private restClient: RestClient, private currentUserService: CurrentUserService, private onOfflineService: OnOfflineService) {
    super();
  }

  public findAll(): Promise<BogenligaResponse<TriggerDO[]>> {
    // return promise
    // sign in success -> resolve promise
    // sign in failure -> reject promise with result
    return new Promise((resolve, reject) => {
      console.log("lel");
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

  public findBySearch(searchTerm: string): Promise<BogenligaResponse<TriggerDO[]>> {
    // return promise
    // sign in success -> resolve promise
    // sign in failure -> reject promise with result
    return (searchTerm === '' || searchTerm === null)
      ? this.findAll()
      : new Promise( (resolve, reject) => {
        this.restClient.GET<Array<VersionedDataTransferObject>>(new UriBuilder().fromPath(this.getUrl()).path('search/' + searchTerm).build())
            .then((data: VersionedDataTransferObject[]) => {
              resolve({result: RequestResult.SUCCESS, payload: fromPayloadArray(data)});
            }, (error: HttpErrorResponse) => {
              (error.status === 0)
                ? reject({result: RequestResult.CONNECTION_PROBLEM})
                : reject({result: RequestResult.FAILURE});
            });
      });
  }

  public findAllByType(type: string): Promise<BogenligaResponse<TriggerDO[]>> {
    if (this.onOfflineService.isOffline()) {
      console.log('Choosing offline way for findall regionen by type');
      return new Promise((resolve, reject) => {
        db.triggerTabelle.toArray()
          .then((data) => {
            const faketrigger: TriggerDO[] = [];
            data.forEach( (verein) => {
              faketrigger.push({
                id: verein.id,
                kategorie: verein.kategorie,
                altsystem_id: verein.altsystem_id,
                operation: verein.operation,
                status: verein.status,
                nachricht: verein.nachricht,
                created_at_utc: verein.created_at_utc,
                run_at_utc: verein.created_at_utc,
                version: 1
              });
            });
            resolve({result: RequestResult.SUCCESS, payload: faketrigger});
          })
          .catch((e) => reject(e));
      });
    } else {
      // return promise
      // sign in success -> resolve promise
      // sign in failure -> reject promise with result
      return new Promise((resolve, reject) => {
        this.restClient.GET<Array<VersionedDataTransferObject>>(new UriBuilder().fromPath(this.getUrl()).path(type).build())
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
  }



  public deleteById(id: number): Promise<BogenligaResponse<void>> {
    // return promise
    // sign in success -> resolve promise
    // sign in failure -> reject promise with result
    return new Promise((resolve, reject) => {
      this.restClient.DELETE<void>(new UriBuilder().fromPath(this.getUrl()).path(id).build())
          .then((noData) => {
            resolve({result: RequestResult.SUCCESS});

          }, (error: HttpErrorResponse) => {

            if (error.status === 0) {
              reject({result: RequestResult.CONNECTION_PROBLEM});
            } else {
              reject({result: RequestResult.FAILURE});
            }
          });
    });
  }

  public findById(id: string | number): Promise<BogenligaResponse<TriggerDO>> {
    // return promise
    // sign in success -> resolve promise
    // sign in failure -> reject promise with result
    return new Promise((resolve, reject) => {
      this.restClient.GET<VersionedDataTransferObject>(new UriBuilder().fromPath(this.getUrl()).path('ID/' + id).build())
          .then((data: VersionedDataTransferObject) => {

            resolve({result: RequestResult.SUCCESS, payload: fromPayload(data)});

          }, (error: HttpErrorResponse) => {

            if (error.status === 0) {
              reject({result: RequestResult.CONNECTION_PROBLEM});
            } else {
              reject({result: RequestResult.FAILURE});
            }
          });
    });
  }

  public create(payload: TriggerDO): Promise<BogenligaResponse<TriggerDO>> {
    // return promise
    // sign in success -> resolve promise
    // sign in failure -> reject promise with result
    return new Promise((resolve, reject) => {
      this.restClient.POST<VersionedDataTransferObject>(new UriBuilder().fromPath(this.getUrl()).build(), payload)
          .then((data: VersionedDataTransferObject) => {
            resolve({result: RequestResult.SUCCESS, payload: fromPayload(data)});

          }, (error: HttpErrorResponse) => {

            if (error.status === 0) {
              reject({result: RequestResult.CONNECTION_PROBLEM});
            } else {
              reject({result: RequestResult.FAILURE});
            }
          });
    });
  }

  public update(payload: VersionedDataTransferObject): Promise<BogenligaResponse<TriggerDO>> {
    // return promise
    // sign in success -> resolve promise
    // sign in failure -> reject promise with result
    return new Promise((resolve, reject) => {
      this.restClient.PUT<VersionedDataTransferObject>(new UriBuilder().fromPath(this.getUrl()).build(), payload)
          .then((data: VersionedDataTransferObject) => {
            resolve({result: RequestResult.SUCCESS, payload: fromPayload(data)});

          }, (error: HttpErrorResponse) => {

            if (error.status === 0) {
              reject({result: RequestResult.CONNECTION_PROBLEM});
            } else {
              reject({result: RequestResult.FAILURE});
            }
          });
    });
  }
  public startSync(){
    this.restClient.GET(new UriBuilder().fromPath(this.getUrl()).path('buttonSync').build())
  }
}
