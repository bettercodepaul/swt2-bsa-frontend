import {Injectable} from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import {
  BogenligaResponse,
  DataProviderService,
  RequestResult,
  RestClient,
  UriBuilder
} from '../../shared/data-provider';
import {MatchDOExt} from '../types/match-do-ext.class';
import {MatchDTOExt} from '../types/datatransfer/match-dto-ext.class';
import {MatchMapperExt} from '../mapper/match-mapper-ext';

@Injectable({
  providedIn: 'root'
})
export class SchusszettelProviderService extends DataProviderService {

  serviceSubUrl = 'v1/match/schusszettel';

  constructor(private restClient: RestClient) {
    super();
  }

  public findMatches(match1Id: string, match2Id: string): Promise<BogenligaResponse<Array<MatchDOExt>>> {
    return new Promise((resolve, reject) => {
      this.restClient.GET<Array<MatchDTOExt>>(new UriBuilder().fromPath(this.getUrl()).path(match1Id).path(match2Id).build())
          .then((data: Array<MatchDTOExt>) => {
            console.log('data in MatchDTO', data);
            const matches = [MatchMapperExt.matchToDO(data[0]), MatchMapperExt.matchToDO(data[1])];
            resolve({result: RequestResult.SUCCESS, payload: matches});
          }, (error: HttpErrorResponse) => {
            if (error.status === 0) {
              reject({result: RequestResult.CONNECTION_PROBLEM});
            } else {
              reject({result: RequestResult.FAILURE});
            }
          });
    });
  }

  public create(match1: MatchDOExt, match2: MatchDOExt): Promise<BogenligaResponse<Array<MatchDOExt>>> {
    const match1DTO = MatchMapperExt.matchToDTO(match1);
    const match2DTO = MatchMapperExt.matchToDTO(match2);
    return new Promise(((resolve, reject) => {
      this.restClient.POST(this.getUrl(), [match1DTO, match2DTO])
          .then((data: Array<MatchDTOExt>) => {
            const matches = [MatchMapperExt.matchToDO(data[0]), MatchMapperExt.matchToDO(data[1])];
            resolve({result: RequestResult.SUCCESS, payload: matches});
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
