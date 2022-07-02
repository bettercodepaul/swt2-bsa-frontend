import {Injectable} from '@angular/core';

import {HttpErrorResponse} from '@angular/common/http';
import {
  BogenligaResponse,
  DataProviderService,
  RequestResult,
  RestClient,
  UriBuilder,
  VersionedDataTransferObject
} from '../../shared/data-provider';
import {CurrentUserService} from '../../shared/services/current-user';
import {fromPayload, fromPayloadArray} from '../mapper/dsb-mitglied-mapper';
import {DsbMitgliedDO} from '../types/dsb-mitglied-do.class';
import {OnOfflineService} from '@shared/services';
import {db} from '@shared/data-provider/offlinedb/offlinedb';
import {OfflineDsbMitglied} from '@shared/data-provider/offlinedb/types/offline-dsbmitglied.interface';
import {fromOfflineToDsbMitgliedDOArray} from '@verwaltung/mapper/dsb-mitglied-offline.mapper';

@Injectable({
  providedIn: 'root'
})
export class DsbMitgliedDataProviderService extends DataProviderService {

  serviceSubUrl = 'v1/dsbmitglied';

  constructor(private restClient: RestClient, private currentUserService: CurrentUserService, private onOfflineService: OnOfflineService) {
    super();
  }

  public create(payload: DsbMitgliedDO): Promise<BogenligaResponse<DsbMitgliedDO>> {
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
            } else if (error.status === 500) {
              console.log(error.status);
              reject({result: RequestResult.DUPLICATE_DETECTED});
            } else {
              reject({result: RequestResult.FAILURE});
            }
          });
    });
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


  public findAll(): Promise<BogenligaResponse<DsbMitgliedDO[]>> {
    if(this.onOfflineService.isOffline()){
      console.log("Choosing offline way for findall dsbmitglieder")
      return new Promise((resolve,reject) =>{
        db.dsbMitgliedTabelle.toArray()
          .then((dsbMitglieder) =>{
            resolve({result: RequestResult.SUCCESS, payload: fromOfflineToDsbMitgliedDOArray(dsbMitglieder)})
          })
          .catch(err => reject(err));
      })
    } else {
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
  }

  public findAllByTeamId(id: string | number): Promise<BogenligaResponse<DsbMitgliedDO[]>> {
    if(this.onOfflineService.isOffline()){
      console.log("Choosing offline way for find dsbmitglieder by teamID")
      return new Promise((resolve,reject) =>{
        let dsbMitglieder: OfflineDsbMitglied[] = []
        db.transaction('rw', db.dsbMitgliedTabelle, db.mannschaftsmitgliedTabelle, tx => {
          db.mannschaftsmitgliedTabelle.where('mannschaftId').equals(id).toArray()
            .then(mitglieder => {
              mitglieder.forEach(mitglied =>{
                db.dsbMitgliedTabelle.get(mitglied.dsbMitgliedId)
                  .then(result => dsbMitglieder.push(result))
              })
            })
        })
          .then(() =>{
            resolve({result: RequestResult.SUCCESS, payload: fromOfflineToDsbMitgliedDOArray(dsbMitglieder)})
          })
          .catch(err => reject(err));
      })
    } else {
      return new Promise((resolve, reject) => {
        this.restClient.GET<Array<VersionedDataTransferObject>>(new UriBuilder().fromPath(this.getUrl()).path('team/' + id).build())
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

  public findBySearch(searchTerm: string): Promise<BogenligaResponse<DsbMitgliedDO[]>> {
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


  public findById(id: string | number): Promise<BogenligaResponse<DsbMitgliedDO>> {
    // return promise
    // sign in success -> resolve promise
    // sign in failure -> reject promise with result
    return new Promise((resolve, reject) => {
      this.restClient.GET<VersionedDataTransferObject>(new UriBuilder().fromPath(this.getUrl()).path(id).build())
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

  public update(payload: VersionedDataTransferObject): Promise<BogenligaResponse<DsbMitgliedDO>> {
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
            } else if (error.status === 500) {
              console.log(error.status);
              reject({result: RequestResult.DUPLICATE_DETECTED});
            } else {
              reject({result: RequestResult.FAILURE});
            }
          });
    });
  }
}
