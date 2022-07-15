import {Injectable} from '@angular/core';
import {
  BogenligaResponse,
  DataProviderService,
  RequestResult,
  RestClient,
  UriBuilder,
  VersionedDataTransferObject
} from '@shared/data-provider';
import {PasseDTOClass} from '@verwaltung/types/datatransfer/passe-dto.class';
import {fromPayloadArray} from '@verwaltung/mapper/passe-mapper';
import {HttpErrorResponse} from '@angular/common/http';
import {CurrentUserService, OnOfflineService} from '@shared/services';
import {PasseDoClass} from '@verwaltung/types/passe-do-class';
import {db} from '@shared/data-provider/offlinedb/offlinedb';
import {OfflinePasse} from '@shared/data-provider/offlinedb/types/offline-passe.interface';
import {toPasseDTOClassFromOfflineArray} from '@verwaltung/mapper/passe-offline-mapper';

@Injectable({
  providedIn: 'root'
})

export class PasseDataProviderService extends DataProviderService {

  serviceSubUrl = 'v1/passen';

  constructor(private restClient: RestClient, private currentUserService: CurrentUserService, private onOfflineService: OnOfflineService) {
    super();
  }

  public findByWettkampfId(wettkampfId: number): Promise<BogenligaResponse<PasseDTOClass[]>> {
    /*if(this.onOfflineService.isOffline()){
      return new Promise((resolve, reject) => {
        db.passeTabelle.where('wettkampfID').equals(wettkampfId).toArray()
          .then((data: OfflinePasse[]) => {
            resolve({result: RequestResult.SUCCESS, payload: toPasseDTOClassFromOfflineArray(data)});
          }, () => {
            reject({result: RequestResult.FAILURE});
          });
      });
    } else {*/
      return new Promise((resolve, reject) => {
        this.restClient.GET<Array<VersionedDataTransferObject>>(new UriBuilder().fromPath(this.getUrl()).path('findByWettkampfId/wettkampfid=' + wettkampfId).build())
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
    // }
  }

  public findOfflineByMatchIds(match1Id: number, match2Id: number): Promise<BogenligaResponse<PasseDTOClass[]>> {
    return new Promise((resolve, reject) => {
      db.passeTabelle.where('matchID').equals(match1Id).or('matchID').equals(match2Id).toArray()
        .then((data: OfflinePasse[]) => {
          resolve({result: RequestResult.SUCCESS, payload: toPasseDTOClassFromOfflineArray(data)});
        }, () => {
          reject({result: RequestResult.FAILURE});
        });
    });
  }

  findAll(): Promise<BogenligaResponse<PasseDoClass[]>> {
    return new Promise((resolve, reject) => {
      this.restClient.GET<Array<VersionedDataTransferObject>>(this.getUrl() + '/')
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
