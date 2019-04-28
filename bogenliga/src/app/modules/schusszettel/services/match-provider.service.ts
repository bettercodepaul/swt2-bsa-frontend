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

@Injectable({
  providedIn: 'root'
})
export class MatchProviderService extends DataProviderService {

  serviceSubUrl = 'v1/match';

  constructor(private restClient: RestClient) {
    super();
  }

  //
  // public findAll(): Promise<BogenligaResponse<PasseDO[]>> {
  //   // return promise
  //   // sign in success -> resolve promise
  //   // sign in failure -> reject promise with result
  //   return new Promise((resolve, reject) => {
  //     this.restClient.GET<Array<VersionedDataTransferObject>>(this.getUrl())
  //         .then((data: VersionedDataTransferObject[]) => {
  //
  //           resolve({result: RequestResult.SUCCESS, payload: fromPayloadArray(data)});
  //
  //         }, (error: HttpErrorResponse) => {
  //
  //           if (error.status === 0) {
  //             reject({result: RequestResult.CONNECTION_PROBLEM});
  //           } else {
  //             reject({result: RequestResult.FAILURE});
  //           }
  //         });
  //   });
  // }
  //
  //

  public create(payload: MatchDO): Promise<BogenligaResponse<MatchDO>> {
    return new Promise(((resolve, reject) => {
      this.restClient.POST(this.getUrl(), payload)
          .then((data: MatchDO) => {
            resolve({result: RequestResult.SUCCESS, payload: data})
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
