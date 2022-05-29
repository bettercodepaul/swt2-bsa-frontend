import {Injectable} from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import {
  BogenligaResponse,
  DataProviderService,
  RequestResult,
  RestClient,
  UriBuilder, VersionedDataTransferObject
} from '../../shared/data-provider';
import { db } from '@shared/data-provider/offlinedb/offlinedb';
import {MatchMapperExt} from '../mapper/match-mapper-ext';
import {MatchDOExt} from '../types/match-do-ext.class';
import {MatchDTOExt} from '../types/datatransfer/match-dto-ext.class';
import {fromPayloadArray} from '../mapper/match-mapper-ext';
import {OnOfflineService} from '@shared/services';
import {OfflineMatch} from '@shared/data-provider/offlinedb/types/offline-match.interface';
import { toDTOFromOfflineMatchArray} from '@verwaltung/mapper/match-offline-mapper';

@Injectable({
  providedIn: 'root'
})
export class MatchProviderService extends DataProviderService {

  serviceSubUrl = 'v1/match';

  constructor(private restClient: RestClient, private onOfflineService: OnOfflineService) {
    super();
  }

  public get(matchId: string): Promise<BogenligaResponse<MatchDOExt>> {
    /*if(this.onOfflineService.isOffline()){
      console.log('Choosing offline way for match with id ' + matchId)
      return new Promise((resolve, reject) => {
        db.matchTabelle.get(Number(matchId))
          .then((data: OfflineMatch) => {
            resolve({result: RequestResult.SUCCESS, payload: toDTOFromOfflineMatch(data,[])});
          }, () => {
            reject({result: RequestResult.FAILURE});
          });
      });
    } else {*/
      return new Promise((resolve, reject) => {
        this.restClient.GET<MatchDTOExt>(new UriBuilder().fromPath(this.getUrl()).path(matchId).build())
            .then((data: MatchDTOExt) => {

              const matchDO = MatchMapperExt.matchToDO(data);
              resolve({result: RequestResult.SUCCESS, payload: matchDO});
            }, (error: HttpErrorResponse) => {
              if (error.status === 0) {
                reject({result: RequestResult.CONNECTION_PROBLEM});
              } else {
                reject({result: RequestResult.FAILURE});
              }
            });
      });
    //}
  }

  public create(matchDO: MatchDOExt): Promise<BogenligaResponse<MatchDOExt>> {
    const matchDTO = MatchMapperExt.matchToDTO(matchDO);
    return new Promise(((resolve, reject) => {
      this.restClient.POST(this.getUrl(), matchDTO)
          .then((data: MatchDTOExt) => {
            const newMatchDO = MatchMapperExt.matchToDO(data);
            resolve({result: RequestResult.SUCCESS, payload: newMatchDO});
          }, (error: HttpErrorResponse) => {
            if (error.status === 0) {
              reject({result: RequestResult.CONNECTION_PROBLEM});
            } else {
              reject({result: RequestResult.FAILURE});
            }
          });
    }));
  }

  public update(matchDO: MatchDOExt): Promise<BogenligaResponse<MatchDOExt>> {
    const matchDTO = MatchMapperExt.matchToDTO(matchDO);
    return new Promise(((resolve, reject) => {
      this.restClient.PUT(this.getUrl(), matchDTO)
          .then((data: MatchDTOExt) => {
            const updatedMatchDO = MatchMapperExt.matchToDO(data);
            resolve({result: RequestResult.SUCCESS, payload: updatedMatchDO});
          }, (error: HttpErrorResponse) => {
            if (error.status === 0) {
              reject({result: RequestResult.CONNECTION_PROBLEM});
            } else {
              reject({result: RequestResult.FAILURE});
            }
          });
    }));
  }


  public findAllWettkampfMatchesAndNamesById(id: number): Promise<BogenligaResponse<MatchDTOExt[]>> {
    if (this.onOfflineService.isOffline()) {
      console.log('Choosing offline way for findallmatches by wettkampfid ' + id)
      return new Promise((resolve, reject) => {
        db.matchTabelle.where('wettkampfId').equals(id).toArray()
          .then((data: OfflineMatch[]) => {
            resolve({result: RequestResult.SUCCESS, payload: toDTOFromOfflineMatchArray(data,[])});
          }, () => {
            reject({result: RequestResult.FAILURE});
          });
      });
    } else {
      // return promise
      // sign in success -> resolve promise
      // sign in failure -> reject promise with result
      return new Promise((resolve, reject) => {
        this.restClient.GET<Array<VersionedDataTransferObject>>(new UriBuilder().fromPath(this.getUrl()).path('findByWettkampfId/wettkampfid=' + id).build())
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


  public next(matchId: number): Promise<BogenligaResponse<Array<number>>> {
    return new Promise(((resolve, reject) => {
      this.restClient.GET(new UriBuilder().fromPath(this.getUrl()).path(matchId).path('next').build())
          .then((data: Array<number>) => {
            resolve({result: RequestResult.SUCCESS, payload: data});
          }, (error: HttpErrorResponse) => {
            if (error.status === 0) {
              reject({result: RequestResult.CONNECTION_PROBLEM});
            } else {
              reject({result: RequestResult.FAILURE});
            }
          });
    }));
  }

  public pair(matchId: number): Promise<BogenligaResponse<Array<number>>> {
    if(this.onOfflineService.isOffline()){
      return new Promise((resolve, reject) => {
        db.matchTabelle.get(matchId)
          .then((data: OfflineMatch) => {
            resolve({result: RequestResult.SUCCESS, payload: [Math.min(data.id,data.matchIdGegner), Math.max(data.id,data.matchIdGegner)]});
          }, () => {
            reject({result: RequestResult.FAILURE});
          });
      });
    } else {
      return new Promise(((resolve, reject) => {
        this.restClient.GET(new UriBuilder().fromPath(this.getUrl()).path(matchId).path('pair').build())
            .then((data: Array<number>) => {
              resolve({result: RequestResult.SUCCESS, payload: data});
            }, (error: HttpErrorResponse) => {
              if (error.status === 0) {
                reject({result: RequestResult.CONNECTION_PROBLEM});
              } else {
                reject({result: RequestResult.FAILURE});
              }
            });
      }));
    }
  }

  public async pairToFollow(matchId: number): Promise<BogenligaResponse<Array<number>>> {
    if(this.onOfflineService.isOffline()){
      let currentPair: number[]
      await this.pair(matchId)
                .then(data => currentPair = data.payload)
                .catch(error => console.error(error))
      let nextMatchId = 0;
      await db.matchTabelle.get(currentPair[1])
        .then(data => nextMatchId = data.naechsteMatchId);
      console.log(matchId + " to next match from offline" + nextMatchId)
      return this.pair(nextMatchId);
    } else {
      return new Promise(((resolve, reject) => {
        this.restClient.GET(new UriBuilder().fromPath(this.getUrl()).path(matchId).path('pairToFollow').build())
            .then((data: Array<number>) => {
              resolve({result: RequestResult.SUCCESS, payload: data});
            }, (error: HttpErrorResponse) => {
              if (error.status === 0) {
                reject({result: RequestResult.CONNECTION_PROBLEM});
              } else {
                reject({result: RequestResult.FAILURE});
              }
            });
      }));
    }
  }

  public async previousPair(matchId: number): Promise<BogenligaResponse<Array<number>>> {
    if (this.onOfflineService.isOffline()) {
      let currentPair = []
      await this.pair(matchId)
        .then(data => currentPair = data.payload)
        .catch(error => console.error(error))
      let lastMatchId = 0;
      await db.matchTabelle.where('naechsteMatchId').equals(currentPair[0]).first()
        .then(data => lastMatchId = data.id)
        .catch(error => console.error(error))
      console.log(lastMatchId)
      return this.pair(lastMatchId);
    } else {
      return new Promise(((resolve, reject) => {
        this.restClient.GET(new UriBuilder().fromPath(this.getUrl()).path(matchId).path('previousPair').build())
            .then((data: Array<number>) => {
              resolve({result: RequestResult.SUCCESS, payload: data});
            }, (error: HttpErrorResponse) => {
              if (error.status === 0) {
                reject({result: RequestResult.CONNECTION_PROBLEM});
              } else {
                reject({result: RequestResult.FAILURE});
              }
            });
      }));
    }
  }
}
