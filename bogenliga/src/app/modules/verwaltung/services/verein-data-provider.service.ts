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
import {CurrentUserService, OnOfflineService} from '@shared/services';
import {fromPayload, fromPayloadArray} from '../mapper/verein-mapper';
import {VereinDO} from '../types/verein-do.class';
import {Observable} from 'rxjs';
import {db} from '@shared/data-provider/offlinedb/offlinedb';
import {toDOfromOfflineVeranstaltungArray} from '@verwaltung/mapper/veranstaltung-offline-mapper';
import {toDOfromOfflineVerein, toDOfromOfflineVereinArray} from '@verwaltung/mapper/verein-offline-mapper';

@Injectable({
  providedIn: 'root'
})
export class VereinDataProviderService extends DataProviderService {

  serviceSubUrl = 'v1/vereine';


  constructor(private restClient: RestClient, private onOfflineService: OnOfflineService , private currentUserService: CurrentUserService) {
    super();
  }

  public findAll(): Promise<BogenligaResponse<VereinDO[]>> {
    if (this.onOfflineService.isOffline()) {
      console.log('Choosing offline way for Verein findall');
      return new Promise((resolve, reject) => {
        db.vereinTabelle.toArray()
          .then((data) => {
            resolve({result: RequestResult.SUCCESS, payload: toDOfromOfflineVereinArray(data)});
          }, () => {
            reject({result: RequestResult.FAILURE});
          });
      });
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

  public findBySearch(searchTerm: string): Promise<BogenligaResponse<VereinDO[]>> {
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

  public findById(id: string | number): Promise<BogenligaResponse<VereinDO>> {
    if (this.onOfflineService.isOffline()) {
      console.log('Choosing offline way for findVerein by id');
      return new Promise((resolve, reject) => {
        let vereinid: number;
        if (typeof id === 'string') {
          vereinid = parseInt(id);
        } else {
          vereinid = id;
        }
        db.vereinTabelle.get(vereinid)
          .then((data) => {
            resolve({result: RequestResult.SUCCESS, payload: toDOfromOfflineVerein(data)});
          }, () => {
            reject({result: RequestResult.FAILURE});
          });
      });
    } else {
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
  }

  public update(payload: VersionedDataTransferObject): Promise<BogenligaResponse<VereinDO>> {
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

  public create(payload: VereinDO): Promise<BogenligaResponse<VereinDO>> {
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

}
