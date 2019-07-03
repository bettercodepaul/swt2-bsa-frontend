import {Injectable} from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import {
  BogenligaResponse,
  DataProviderService,
  RequestResult,
  RestClient,
  UriBuilder
} from '../../shared/data-provider';
import {SchusszettelMapper} from '../mapper/schusszettel-mapper';
import {MatchDO} from '../types/match-do.class';
import {MatchDTO} from '../types/datatransfer/match-dto.class';

@Injectable({
  providedIn: 'root'
})
export class MatchProviderService extends DataProviderService {

  serviceSubUrl = 'v1/match';

  constructor(private restClient: RestClient) {
    super();
  }

  public get(matchId: string): Promise<BogenligaResponse<MatchDO>> {
    return new Promise((resolve, reject) => {
      this.restClient.GET<MatchDTO>(new UriBuilder().fromPath(this.getUrl()).path(matchId).build())
          .then((data: MatchDTO) => {
            const matchDO = SchusszettelMapper.matchToDO(data);
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

  public create(matchDO: MatchDO): Promise<BogenligaResponse<MatchDO>> {
    const matchDTO = SchusszettelMapper.matchToDTO(matchDO);
    return new Promise(((resolve, reject) => {
      this.restClient.POST(this.getUrl(), matchDTO)
          .then((data: MatchDTO) => {
            const matchDO = SchusszettelMapper.matchToDO(data);
            resolve({result: RequestResult.SUCCESS, payload: matchDO});
          }, (error: HttpErrorResponse) => {
            if (error.status === 0) {
              reject({result: RequestResult.CONNECTION_PROBLEM});
            } else {
              reject({result: RequestResult.FAILURE});
            }
          });
    }));
  }

  public update(matchDO: MatchDO): Promise<BogenligaResponse<MatchDO>> {
    const matchDTO = SchusszettelMapper.matchToDTO(matchDO);
    return new Promise(((resolve, reject) => {
      this.restClient.PUT(this.getUrl(), matchDTO)
          .then((data: MatchDTO) => {
            const matchDO = SchusszettelMapper.matchToDO(data);
            resolve({result: RequestResult.SUCCESS, payload: matchDO});
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
