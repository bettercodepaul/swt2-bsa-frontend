import {Injectable} from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import {
  BogenligaResponse,
  DataProviderService,
  RequestResult,
  RestClient,
  UriBuilder, VersionedDataTransferObject
} from '../../shared/data-provider';
import {MatchMapper} from '../mapper/match-mapper';
import {MatchDOExt} from '../types/match-do-ext.class';
import {MatchDTOExt} from '../types/datatransfer/match-dto-ext.class';
import {fromPayloadArray} from "@vereine/mapper/match-mapper";

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
            const matchDO = MatchMapper.matchToDO(data);
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
    const matchDTO = MatchMapper.matchToDTO(matchDO);
    return new Promise(((resolve, reject) => {
      this.restClient.POST(this.getUrl(), matchDTO)
          .then((data: MatchDTOExt) => {
            const newMatchDO = MatchMapper.matchToDO(data);
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
    const matchDTO = MatchMapper.matchToDTO(matchDO);
    return new Promise(((resolve, reject) => {
      this.restClient.PUT(this.getUrl(), matchDTO)
          .then((data: MatchDTOExt) => {
            const updatedMatchDO = MatchMapper.matchToDO(data);
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
}
