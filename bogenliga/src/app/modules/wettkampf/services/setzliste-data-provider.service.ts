import {Injectable} from '@angular/core';

import {
  DataProviderService,
  RequestResult,
  Response,
  RestClient,
  UriBuilder,
  VersionedDataTransferObject
} from '../../shared/data-provider';
import {CurrentUserService} from '../../shared/services/current-user';
import {HttpErrorResponse} from '@angular/common/http';
import {fromPayload} from '../../verwaltung/mapper/setzliste-mapper';
// import {fromPayload} from '../../verwaltung/mapper/setzliste-mapper';
@Injectable({
  providedIn: 'root'
})
export class SetzlisteDataProviderService extends DataProviderService {

  serviceSubUrl = 'v1/setzliste';

  constructor(private restClient: RestClient, private currentUserService: CurrentUserService) {
    super();
  }


  public getSetzlisteAsPDF(id: string | number): Promise<Response<Blob>> {
    // return promise
    // sign in success -> resolve promise
    // sign in failure -> reject promise with result
    return new Promise((resolve, reject) => {
      this.restClient.POST<VersionedDataTransferObject>(new UriBuilder().fromPath(this.getUrl()).build(), '')
        .then((data: VersionedDataTransferObject) => {
          resolve({result: RequestResult.SUCCESS, payload: fromPayload(data)});
          // resolve({result: RequestResult.SUCCESS, payload: data});
        }, (error: HttpErrorResponse) => {

          if (error.status === 0) {
            reject({result: RequestResult.CONNECTION_PROBLEM});
          } else {
            reject({result: RequestResult.FAILURE});
          }
        });
    });
  }

  // public getSetzlisteAsPDFv2(id: string | number): Promise<Response<Blob>> {
  //   return this.restClient.POST<VersionedDataTransferObject>(new UriBuilder().fromPath(this.getUrl()).build(), { responseType: 'blob'}).then((data: VersionedDataTransferObject) => {
  //       return new Blob([res], { type: 'application/pdf', });
  //     });
  // }

}
