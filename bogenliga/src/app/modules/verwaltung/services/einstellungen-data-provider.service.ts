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
import {EinstellungenDO} from '@verwaltung/types/einstellungen-do.class';
import {fromPayloadArray} from '@verwaltung/mapper/einstellungen-mapper';
import {HttpErrorResponse} from '@angular/common/http';
import {fromPayload} from '@verwaltung/mapper/einstellungen-mapper';
import {EinstellungenDTO} from '@verwaltung/types/datatransfer/einstellungen-dto.class';




@Injectable({
  providedIn: 'root'
})
export class EinstellungenProviderService  extends DataProviderService {
  serviceSubUrl = 'v1/einstellungen';


  constructor(private restClient: RestClient, private currentUserService: CurrentUserService) {
    super();
  }

  public findAll(): Promise<BogenligaResponse<EinstellungenDO>> {
    // return promise
    // sign in success -> resolve promise
    // sign in failure -> reject promise with result
    console.log("findall wurde aufgerufen");
    return new Promise((resolve, reject) => {
      this.restClient.GET<VersionedDataTransferObject>(this.getUrl())
          .then((data: VersionedDataTransferObject) => {

            resolve({result: RequestResult.SUCCESS, payload: fromPayload(data)});

          }, (error: HttpErrorResponse) => {

            if (error.status === 0) {
              reject({result: RequestResult.CONNECTION_PROBLEM});
            } else {
              reject({result: RequestResult.FAILURE});
            }
          });
    });
  }

  public create(payload: EinstellungenDO): Promise<BogenligaResponse<EinstellungenDO>> {
    // return promise
    // sign in success -> resolve promise
    // sign in failure -> reject promise with result
    return new Promise((resolve, reject) => {
      this.restClient.POST<VersionedDataTransferObject>(new UriBuilder().fromPath(this.getUrl()).build(), payload)
          .then((data: VersionedDataTransferObject) => {
            resolve({result: RequestResult.SUCCESS, payload: fromPayload(data)});

          }, (error: HttpErrorResponse) => {

            if (error.status === 0) {
              reject({result: RequestResult.CONNECTION_PROBLEM});
            } else if (error.status === 500) {
              console.log(error.status);
              reject({result: RequestResult.DUPLICATE_DETECTED});
            } else {
              reject({result: RequestResult.FAILURE});
            }
          });
    });
  }


}
