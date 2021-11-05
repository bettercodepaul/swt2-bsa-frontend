import {Injectable} from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import {
  BogenligaResponse,
  DataProviderService,
  RequestResult,
  RestClient,
  UriBuilder, VersionedDataTransferObject
} from '../../shared/data-provider';
import {MatchMapperExt} from '../mapper/match-mapper-ext';
import {MatchDOExt} from '../types/match-do-ext.class';
import {MatchDTOExt} from '../types/datatransfer/match-dto-ext.class';
import {fromPayloadArray} from '../mapper/match-mapper-ext';

@Injectable({
  providedIn: 'root'
})
export class MatchProviderService extends DataProviderService {

  serviceSubUrl = 'v1/match';

  constructor(private restClient: RestClient) {
    super();
  }

  public get(matchId: string): Promise<BogenligaResponse<MatchDOExt>> {
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

  public pairToFollow(matchId: number): Promise<BogenligaResponse<Array<number>>> {
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
