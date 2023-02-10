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
import {fromPayload, fromPayloadArray, fromVeranstaltungsPayload} from '../mapper/match-mapper';
import {MatchDO} from '../types/match-do.class';
import {VeranstaltungDO} from '@verwaltung/types/veranstaltung-do.class';
import {VeranstaltungDTO} from '@verwaltung/types/datatransfer/veranstaltung-dto.class';
import {MatchDTO} from '@verwaltung/types/datatransfer/match-dto.class';
import {WettkampfDO} from '@verwaltung/types/wettkampf-do.class';
import {log} from 'util';
import {MatchDTOExt} from '@wkdurchfuehrung/types/datatransfer/match-dto-ext.class';

@Injectable({
  providedIn: 'root'
})
export class MatchDataProviderService extends DataProviderService {

  serviceSubUrl = 'v1';
  wettkampfId: WettkampfDO;


  constructor(private restClient: RestClient, private currentUserService: CurrentUserService) {
    super();
  }

  public findAllbyMannschaftsID(id: number): Promise<BogenligaResponse<MatchDO[]>> {
    // return promise
    // sign in success -> resolve promise
    // sign in failure -> reject promise with result
    return new Promise((resolve, reject) => {
      this.restClient.GET<Array<VersionedDataTransferObject>>(new UriBuilder().fromPath(this.getUrl()).path('match/byMannschaftsId/' + id).build())
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


  public findAllWettkampfMatchesById(id: number): Promise<BogenligaResponse<MatchDO[]>> {
    // return promise
    // sign in success -> resolve promise
    // sign in failure -> reject promise with result
    return new Promise((resolve, reject) => {
      this.restClient.GET<Array<VersionedDataTransferObject>>(new UriBuilder().fromPath(this.getUrl()).path('match/findByWettkampfId/wettkampfid=' + id).build())
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


  public findAll(): Promise<BogenligaResponse<MatchDO[]>> {
    return new Promise((resolve, reject) => {
      this.restClient.GET<Array<VersionedDataTransferObject>>(this.getUrl() + 'match/')
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

  public createInitialMatchesWT0(payload: VeranstaltungDO): Promise<BogenligaResponse<VeranstaltungDO>> {
      // return promise
      // sign in success -> resolve promise
      // sign in failure -> reject promise with result
    return new Promise((resolve, reject) => {
          this.restClient.POST<VersionedDataTransferObject>(new UriBuilder().fromPath(this.getUrl()).path('match/WT0').build(), payload)
            .then((data: VersionedDataTransferObject) => {
              resolve({result: RequestResult.SUCCESS, payload: fromVeranstaltungsPayload(data)});

            }, (error: HttpErrorResponse) => {

              if (error.status === 0) {
                reject({result: RequestResult.CONNECTION_PROBLEM});
              } else {
                reject({result: RequestResult.FAILURE});
              }
            });
        });
    }



  public generateDataForMatches(wetttkampfId: number): Promise<BogenligaResponse<MatchDO[]>> {
    console.log('In Funktion generateDataForMatches');

    return new Promise((resolve, reject) => {
      this.restClient.GET<Array<VersionedDataTransferObject>>(new UriBuilder().fromPath(this.getUrl()).path('setzliste/generate?wettkampfid=' + wetttkampfId).build())
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

  //
  // public deleteById(id: number): Promise<BogenligaResponse<void>> {
  //   // return promise
  //   // sign in success -> resolve promise
  //   // sign in failure -> reject promise with result
  //   return new Promise((resolve, reject) => {
  //     this.restClient.DELETE<void>(new UriBuilder().fromPath(this.getUrl()).path(id).build())
  //       .then((noData) => {
  //         resolve({result: RequestResult.SUCCESS});
  //
  //       }, (error: HttpErrorResponse) => {
  //
  //         if (error.status === 0) {
  //           reject({result: RequestResult.CONNECTION_PROBLEM});
  //         } else {
  //           reject({result: RequestResult.FAILURE});
  //         }
  //       });
  //   });
  // }
  //
  // public findById(id: string | number): Promise<BogenligaResponse<VereinDO>> {
  //   // return promise
  //   // sign in success -> resolve promise
  //   // sign in failure -> reject promise with result
  //   return new Promise((resolve, reject) => {
  //     this.restClient.GET<VersionedDataTransferObject>(new UriBuilder().fromPath(this.getUrl()).path(id).build())
  //       .then((data: VersionedDataTransferObject) => {
  //
  //         resolve({result: RequestResult.SUCCESS, payload: fromPayload(data)});
  //
  //       }, (error: HttpErrorResponse) => {
  //
  //         if (error.status === 0) {
  //           reject({result: RequestResult.CONNECTION_PROBLEM});
  //         } else {
  //           reject({result: RequestResult.FAILURE});
  //         }
  //       });
  //   });
  // }
  //
  // public update(payload: VersionedDataTransferObject): Promise<BogenligaResponse<VereinDO>> {
  //   // return promise
  //   // sign in success -> resolve promise
  //   // sign in failure -> reject promise with result
  //   return new Promise((resolve, reject) => {
  //     this.restClient.PUT<VersionedDataTransferObject>(new UriBuilder().fromPath(this.getUrl()).build(), payload)
  //       .then((data: VersionedDataTransferObject) => {
  //         resolve({result: RequestResult.SUCCESS, payload: fromPayload(data)});
  //
  //       }, (error: HttpErrorResponse) => {
  //
  //         if (error.status === 0) {
  //           reject({result: RequestResult.CONNECTION_PROBLEM});
  //         } else {
  //           reject({result: RequestResult.FAILURE});
  //         }
  //       });
  //   });
  // }
  //
  // public create(payload: VereinDO): Promise<BogenligaResponse<VereinDO>> {
  //   // return promise
  //   // sign in success -> resolve promise
  //   // sign in failure -> reject promise with result
  //   return new Promise((resolve, reject) => {
  //     this.restClient.POST<VersionedDataTransferObject>(new UriBuilder().fromPath(this.getUrl()).build(), payload)
  //       .then((data: VersionedDataTransferObject) => {
  //         resolve({result: RequestResult.SUCCESS, payload: fromPayload(data)});
  //
  //       }, (error: HttpErrorResponse) => {
  //
  //         if (error.status === 0) {
  //           reject({result: RequestResult.CONNECTION_PROBLEM});
  //         } else {
  //           reject({result: RequestResult.FAILURE});
  //         }
  //       });
  //   });
  // }
}
