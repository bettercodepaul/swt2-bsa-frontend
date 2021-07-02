import {HttpErrorResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {
  BogenligaResponse,
  DataProviderService,
  RequestResult,
  RestClient,
  UriBuilder,
  VersionedDataTransferObject
} from '../../shared/data-provider';
import {CurrentUserService} from '@shared/services';
import {fromPayload, fromPayloadArray} from '../mapper/kampfrichter-mapper';
import {fromPayloadExtended, fromPayloadArrayExtended} from '../mapper/kampfrichter-extended-mapper';
import {KampfrichterDO} from '../types/kampfrichter-do.class';
import {KampfrichterExtendedDO} from '../types/kampfrichter-extended-dto.class';

@Injectable({
  providedIn: 'root'
})
export class KampfrichterProviderService extends DataProviderService {

  serviceSubUrl = 'v1/kampfrichter';

  constructor(private restClient: RestClient, private currentUserService: CurrentUserService) {
    super();
  }

  public findAll(): Promise<BogenligaResponse<KampfrichterDO[]>> {
    // return promise
    // sign in success -> resolve promise
    // sign in failure -> reject promise with result
    return new Promise((resolve, reject) => {
      this.restClient.GET<Array<VersionedDataTransferObject>>(this.getUrl())
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

  // // This method has been replaced by the delete() method
  // public deleteById(id: number): Promise<BogenligaResponse<void>> {
  //   // return promise
  //   // sign in success -> resolve promise
  //   // sign in failure -> reject promise with result
  //   return new Promise((resolve, reject) => {
  //     this.restClient.DELETE<void>(new UriBuilder().fromPath(this.getUrl()).path(id).build())
  //         .then((noData) => {
  //           resolve({result: RequestResult.SUCCESS});
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

  public delete(userID: number, wettkampfID: number): Promise<BogenligaResponse<void>> {
    // return promise
    // sign in success -> resolve promise
    // sign in failure -> reject promise with result
    return new Promise((resolve, reject) => {
      this.restClient.DELETE<void>(new UriBuilder().fromPath(this.getUrl()).path(`${userID}/${wettkampfID}`).build())
          .then((noData) => {
            resolve({result: RequestResult.SUCCESS});

          }, (error: HttpErrorResponse) => {

            if (error.status === 0) {
              reject({result: RequestResult.CONNECTION_PROBLEM});
            } else {
              reject({result: RequestResult.FAILURE});
            }
          });
    });
  }

  public findById(id: string | number): Promise<BogenligaResponse<KampfrichterDO>> {
    // return promise
    // sign in success -> resolve promise
    // sign in failure -> reject promise with result
    return new Promise((resolve, reject) => {
      this.restClient.GET<VersionedDataTransferObject>(new UriBuilder().fromPath(this.getUrl()).path(id).build())
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

  public findExtendedByIdNotAssignedToId(id: string | number): Promise<BogenligaResponse<KampfrichterExtendedDO[]>> {
    // return promise
    // sign in success -> resolve promise
    // sign in failure -> reject promise with result
    return new Promise((resolve, reject) => {
      this.restClient.GET<Array<VersionedDataTransferObject>>(new UriBuilder().fromPath(this.getUrl()).path("NotAssignedKampfrichter/"+id).build())
          .then((data: VersionedDataTransferObject[]) => {
            resolve({result: RequestResult.SUCCESS, payload: fromPayloadArrayExtended(data)});
          }, (error: HttpErrorResponse) => {

            if (error.status === 0) {
              reject({result: RequestResult.CONNECTION_PROBLEM});
            } else {
              reject({result: RequestResult.FAILURE});
            }
          });
    });

  }

  public findExtendedByIdAssignedToId(id: string | number): Promise<BogenligaResponse<KampfrichterExtendedDO[]>> {
    // return promise
    // sign in success -> resolve promise
    // sign in failure -> reject promise with result
    return new Promise((resolve, reject) => {
      this.restClient.GET<Array<VersionedDataTransferObject>>(new UriBuilder().fromPath(this.getUrl()).path("AssignedKampfrichter/"+id).build())
          .then((data: VersionedDataTransferObject[]) => {
            resolve({result: RequestResult.SUCCESS, payload: fromPayloadArrayExtended(data)});
          }, (error: HttpErrorResponse) => {

            if (error.status === 0) {
              reject({result: RequestResult.CONNECTION_PROBLEM});
            } else {
              reject({result: RequestResult.FAILURE});
            }
          });
    });

  }


  // public update(payload: VersionedDataTransferObject): Promise<BogenligaResponse<KampfrichterDO>> { // DO or DTO? Probably DO.
  //   console.log('KampfrichterProviderService:');
  //   console.log(payload);
  //   // return promise
  //   // sign in success -> resolve promise
  //   // sign in failure -> reject promise with result
  //   return new Promise((resolve, reject) => {
  //     this.restClient.PUT<VersionedDataTransferObject>(new UriBuilder().fromPath(this.getUrl()).build(), payload)
  //         .then((data: VersionedDataTransferObject) => {
  //           resolve({result: RequestResult.SUCCESS, payload: fromPayload(data)});
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


  public create(payload: KampfrichterDO): Promise<BogenligaResponse<KampfrichterDO>> {
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
            } else {
              reject({result: RequestResult.FAILURE});
            }
          });
    });
  }
}

