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
import {MatchDO} from '../types/match-do.class';
import {MatchDTO} from '../types/datatransfer/match-dto.class';
import {SchusszettelMapper} from '../mapper/schusszettel-mapper';

@Injectable({
  providedIn: 'root'
})
export class SchusszettelProviderService extends DataProviderService {

  serviceSubUrl = 'v1/match/schusszettel';

  constructor(private restClient: RestClient) {
    super();
  }

  public findMatches(match1Id: string, match2Id: string): Promise<BogenligaResponse<Array<MatchDO>>> {
    return new Promise((resolve, reject) => {
      this.restClient.GET<Array<MatchDTO>>(new UriBuilder().fromPath(this.getUrl()).path(match1Id + '/' + match2Id).build())
          .then((data: Array<MatchDTO>) => {
            let matches = [SchusszettelMapper.matchToDO(data[0]), SchusszettelMapper.matchToDO(data[1])];
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

  public create(match1: MatchDO, match2: MatchDO): Promise<BogenligaResponse<Array<MatchDO>>> {
    let match1DTO = SchusszettelMapper.matchToDTO(match1);
    let match2DTO = SchusszettelMapper.matchToDTO(match2);
    return new Promise(((resolve, reject) => {
      this.restClient.POST(this.getUrl(), {matches: [match1DTO, match2DTO]})
          .then((data: Array<MatchDTO>) => {
            let matches = [SchusszettelMapper.matchToDO(data[0]), SchusszettelMapper.matchToDO(data[1])];
            resolve({result: RequestResult.SUCCESS, payload: matches})
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
