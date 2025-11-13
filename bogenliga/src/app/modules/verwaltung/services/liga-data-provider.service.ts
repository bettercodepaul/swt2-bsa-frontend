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
import {CurrentUserService} from '../../shared/services/current-user';
import {fromPayload, fromPayloadArray} from '../mapper/liga-mapper';
import {LigaDO} from '../types/liga-do.class';
import {ConsoleLogger} from '@angular/compiler-cli/ngcc';
import {slugifyLigaName} from "@shared/functions/slug-utils";

@Injectable({
  providedIn: 'root'
})
export class LigaDataProviderService  extends DataProviderService {
  serviceSubUrl = 'v1/liga';


  constructor(private restClient: RestClient, private currentUserService: CurrentUserService) {
    super();
  }
  public findAll(): Promise<BogenligaResponse<LigaDO[]>> {
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

  public findByLowest(id:number): Promise<BogenligaResponse<LigaDO>> {
    // return promise
    // sign in success -> resolve promise
    // sign in failure -> reject promise with result
    return new Promise((resolve, reject) => {
      this.restClient.GET<VersionedDataTransferObject>(new UriBuilder().fromPath(this.getUrl()).path('lowest').path(id).build())
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

  public findBySearch(searchTerm: string): Promise<BogenligaResponse<LigaDO[]>> {
    // return promise
    // sign in success -> resolve promise
    // sign in failure -> reject promise with result
    return (searchTerm === '' || searchTerm === null)
      ? this.findAll()
      : new Promise( (resolve, reject) => {
        this.restClient.GET<Array<VersionedDataTransferObject>>(new UriBuilder().fromPath(this.getUrl()).path('search/' + searchTerm).build())
            .then((data: VersionedDataTransferObject[]) => {
              resolve({result: RequestResult.SUCCESS, payload: fromPayloadArray(data)});
            }, (error: HttpErrorResponse) => {
              (error.status === 0)
                ? reject({result: RequestResult.CONNECTION_PROBLEM})
                : reject({result: RequestResult.FAILURE});
            });
      });
  }

  /**
   * Findet eine Liga anhand eines Slugs.
   * Bevorzugt Backend-Endpoint /v1/liga/slug/{slug}.
   * Fällt zurück auf Client-Suche über alle Ligen, falls Endpoint nicht verfügbar ist.
   */
  public findBySlug(slug: string): Promise<BogenligaResponse<LigaDO>> {
    // Übergangslösung ohne Backend-Endpoint und ohne slug-Spalte:
    // 1) Alle Ligen laden
    // 2) Slug clientseitig vergleichen
    const slugLower = (slug || '').toLowerCase();

    return new Promise((resolve, reject) => {
      this.findAll().then((all) => {
        const list = all.payload ?? [];
        const match = list.find(l => slugifyLigaName(l.name ?? '') === slugLower);
        if (match) {
          resolve({ result: RequestResult.SUCCESS, payload: match });
        } else {
          // Optionaler numeric Fallback: falls slug numerisch ist, versuche findById
          if (/^[0-9]+$/.test(slugLower)) {
            this.findById(slugLower).then(resolve).catch(() => {
              resolve({ result: RequestResult.FAILURE, payload: new LigaDO() as any });
            });
          } else {
            resolve({ result: RequestResult.FAILURE, payload: new LigaDO() as any });
          }
        }
      }).catch((error) => {
        if (error?.result === RequestResult.CONNECTION_PROBLEM) {
          reject(error);
        } else {
          resolve({ result: RequestResult.FAILURE, payload: new LigaDO() as any });
        }
      });
    });
  }


  public deleteById(id: number): Promise<BogenligaResponse<void>> {
    // return promise
    // sign in success -> resolve promise
    // sign in failure -> reject promise with result
    return new Promise((resolve, reject) => {
      this.restClient.DELETE<void>(new UriBuilder().fromPath(this.getUrl()).path(id).build())
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



  public findById(id: string | number): Promise<BogenligaResponse<LigaDO>> {
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

  public checkExists(id: string | number): Promise<BogenligaResponse<LigaDO>> {
    // return promise
    // sign in success -> resolve promise
    // sign in failure -> reject promise with result
    return new Promise((resolve, reject) => {
      this.restClient.GET<VersionedDataTransferObject>(new UriBuilder().fromPath(this.getUrl()).path('checkExist').path(id).build())
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

  public checkExistsLigaName(liganame: string ): Promise<BogenligaResponse<LigaDO>> {
    // return promise
    // sign in success -> resolve promise
    // sign in failure -> reject promise with result
    return new Promise((resolve, reject) => {
      this.restClient.GET<VersionedDataTransferObject>(new UriBuilder().fromPath(this.getUrl()).path('checkExistsLigaName').path(liganame).build())
          .then((data: VersionedDataTransferObject) => {
            console.log("Liga Data PRovider");
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

  public update(payload: VersionedDataTransferObject): Promise<BogenligaResponse<LigaDO>> {
    // return promise
    // sign in success -> resolve promise
    // sign in failure -> reject promise with result
    return new Promise((resolve, reject) => {
      const temp = new UriBuilder().fromPath(this.getUrl()).build();
      console.log(temp);
      this.restClient.PUT<VersionedDataTransferObject>(temp, payload)
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
  public create(payload: LigaDO): Promise<BogenligaResponse<LigaDO>> {
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
