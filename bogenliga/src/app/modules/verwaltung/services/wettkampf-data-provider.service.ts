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
import {db} from '@shared/data-provider/offlinedb/offlinedb'
import {CurrentUserService, OnOfflineService} from '@shared/services';
import {fromPayload, fromPayloadArray} from '../mapper/wettkampf-mapper';
import {WettkampfDTO} from '@verwaltung/types/datatransfer/wettkampf-dto.class';
import {OfflineWettkampf} from '@shared/data-provider/offlinedb/types/offline-wettkampf.interface';
import { toDTOFromOfflineWettkampf, toDTOFromOfflineWettkampfArray} from '@verwaltung/mapper/wettkampf-offline-mapper';


@Injectable({
  providedIn: 'root'
})
export class WettkampfDataProviderService extends DataProviderService {

  serviceSubUrl = 'v1/wettkampf';


  constructor(private restClient: RestClient, private currentUserService: CurrentUserService, private onOfflineService: OnOfflineService) {
    super();
  }

  public findAll(): Promise<BogenligaResponse<WettkampfDTO[]>> {
    if(this.onOfflineService.isOffline()){
      console.log("Choosing offline way for wettkampf findall")
      return new Promise((resolve,reject) =>{
        db.wettkampfTabelle.toArray()
          .then((data) => {
            resolve({result: RequestResult.SUCCESS, payload: toDTOFromOfflineWettkampfArray(data)});
          }, () => {
            reject({result: RequestResult.FAILURE});
            })
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
              console.log('wettkampf-data-provider', error);
              if (error.status === 0) {
                reject({result: RequestResult.CONNECTION_PROBLEM});
              } else {
                reject({result: RequestResult.FAILURE});
              }
            });
      });
    }
  }

  public findById(id: string | number): Promise<BogenligaResponse<WettkampfDTO>> {
    if(this.onOfflineService.isOffline()) {
      console.log('Choosing offline way for wettkampf with id '+ id);
      return new Promise((resolve, reject) => {
        db.wettkampfTabelle.where('wettkampf_id').equals(id).toArray()[0]
          .then((data: OfflineWettkampf) => {
            resolve({result: RequestResult.SUCCESS, payload: toDTOFromOfflineWettkampf(data)});

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

  public findAllowedMember(wettkampfID: string | number, mannschaft1ID: string | number, mannschaft2ID: string | number): Promise<number[]> {
    // return promise
    // sign in success -> resolve promise
    // sign in failure -> reject promise with result
    return new Promise((resolve, reject) => {
      this.restClient.GET<number[]>(new UriBuilder().fromPath(this.getUrl()).path(wettkampfID).path(mannschaft1ID).path(mannschaft2ID).path('allowedContestants').build())
          .then((data: number[]) => {

            resolve(data);

          }, (error: HttpErrorResponse) => {

            if (error.status === 0) {
              reject({result: RequestResult.CONNECTION_PROBLEM});
            } else {
              reject({result: RequestResult.FAILURE});
            }
          });
    });
  }

  public findByVeranstaltungId(veranstaltungId: number): Promise<BogenligaResponse<WettkampfDTO[]>> {
    if(this.onOfflineService.isOffline()){
      console.log('Choosing offline way for wettkampf with veranstaltungID '+ veranstaltungId);
      return new Promise((resolve, reject) => {
        db.wettkampfTabelle.where('veranstaltungId').equals(veranstaltungId).toArray()
          .then((data) => {
            resolve({result: RequestResult.SUCCESS, payload: toDTOFromOfflineWettkampfArray(data)});
          }, () => {
            reject({result: RequestResult.FAILURE});
          });
      });
    } else {
    return new Promise((resolve, reject) => {
      this.restClient.GET<Array<VersionedDataTransferObject>>(new UriBuilder().fromPath(this.getUrl()).path('byVeranstaltungId/' + veranstaltungId).build())
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

  public findAllWettkaempfeByMannschaftsId(id: string | number): Promise<BogenligaResponse<WettkampfDTO[]>> {
    // return promise
    // sign in success -> resolve promise
    // sign in failure -> reject promise with result
    return new Promise((resolve, reject) => {
      this.restClient.GET<Array<VersionedDataTransferObject>>(new UriBuilder().fromPath(this.getUrl()).path('byMannschaftsId/' + id).build())
          .then((data: VersionedDataTransferObject[]) => {
            console.log('wettkaempfe raw data');
            console.log(data);

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


  public findAllByVeranstaltungId(id: string | number): Promise<BogenligaResponse<WettkampfDTO[]>> {
    if(this.onOfflineService.isOffline()){
      console.log('Choosing offline way for wettkampf findallbyVeranstaltungID with ID '+ id);
      return new Promise((resolve, reject) => {
        db.wettkampfTabelle.where('veranstaltungId').equals(id).toArray()
          .then((data) => {
            resolve({result: RequestResult.SUCCESS, payload: toDTOFromOfflineWettkampfArray(data)});
          }, () => {
            reject({result: RequestResult.FAILURE});
          });
      });
    } else {
      // return promise
      // sign in success -> resolve promise
      // sign in failure -> reject promise with result
      return new Promise((resolve, reject) => {
        this.restClient.GET<Array<VersionedDataTransferObject>>(new UriBuilder().fromPath(this.getUrl()).path('byVeranstaltungId/' + id).build())
            .then((data: VersionedDataTransferObject[]) => {
              console.log('Veranstaltung raw data');
              console.log(data);
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

  public update(payload: VersionedDataTransferObject): Promise<BogenligaResponse<WettkampfDTO>> {
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

  public create(payload: VersionedDataTransferObject): Promise<BogenligaResponse<WettkampfDTO>> {
    // return promise
    // sign in success -> resolve promise
    // sign in failure -> reject promise with result
    console.log('create Methode');
    return new Promise((resolve, reject) => {
      this.restClient.POST<VersionedDataTransferObject>(new UriBuilder().fromPath(this.getUrl()).build(), payload)
          .then((data: VersionedDataTransferObject) => {
            console.log('Then create');
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
}
