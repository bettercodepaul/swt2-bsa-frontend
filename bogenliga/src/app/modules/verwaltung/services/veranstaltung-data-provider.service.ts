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
import {fromPayload, fromPayloadArray, fromPlayloadArraySp} from '../mapper/veranstaltung-mapper';
import {VeranstaltungDO} from '../types/veranstaltung-do.class';
import {SportjahrVeranstaltungDO} from '@verwaltung/types/sportjahr-veranstaltung-do';
import {OnOfflineService} from '@shared/services';
import {fromOfflineSportjahr} from '@verwaltung/mapper/sportjahr-offline-mapper';
import {db} from '@shared/data-provider/offlinedb/offlinedb';
import {
  toDOfromOfflineVeranstaltung,
  toDOfromOfflineVeranstaltungArray
} from '@verwaltung/mapper/veranstaltung-offline-mapper';
import {OfflineVeranstaltung} from '@shared/data-provider/offlinedb/types/offline-veranstaltung.interface';

@Injectable({
  providedIn: 'root'
})
export class VeranstaltungDataProviderService  extends DataProviderService {
  serviceSubUrl = 'v1/veranstaltung';


  constructor(private restClient: RestClient, private currentUserService: CurrentUserService, private onOfflineService: OnOfflineService) {
    super();
  }

  public findAll(): Promise<BogenligaResponse<VeranstaltungDO[]>> {
    if (this.onOfflineService.isOffline()) {
      console.log('Choosing offline way for Veranstaltungen findall');
      return new Promise((resolve, reject) => {
        db.veranstaltungTabelle.toArray()
          .then((data) => {
            resolve({result: RequestResult.SUCCESS, payload: toDOfromOfflineVeranstaltungArray(data)});
          }, () => {
            reject({result: RequestResult.FAILURE});
          });
      });
    } else {
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
  }

  public findAllGeplantLaufend(): Promise<BogenligaResponse<VeranstaltungDO[]>> {
    if (this.onOfflineService.isOffline()) {
      console.log('Choosing offline way for Veranstaltungen findall');
      return new Promise((resolve, reject) => {
        db.veranstaltungTabelle.toArray()
          .then((data) => {
            resolve({result: RequestResult.SUCCESS, payload: toDOfromOfflineVeranstaltungArray(data)});
          }, () => {
            reject({result: RequestResult.FAILURE});
          });
      });
    } else {
      // return promise
      // sign in success -> resolve promise
      // sign in failure -> reject promise with result
      return new Promise((resolve, reject) => {
        this.restClient.GET<Array<VersionedDataTransferObject>>(new UriBuilder().fromPath(this.getUrl()).path('GeplantLaufend').build())
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
  }

  public findAllLaufendAbgeschlossen(): Promise<BogenligaResponse<VeranstaltungDO[]>> {
    if (this.onOfflineService.isOffline()) {
      console.log('Choosing offline way for Veranstaltungen findall');
      return new Promise((resolve, reject) => {
        db.veranstaltungTabelle.toArray()
          .then((data) => {
            resolve({result: RequestResult.SUCCESS, payload: toDOfromOfflineVeranstaltungArray(data)});
          }, () => {
            reject({result: RequestResult.FAILURE});
          });
      });
    } else {
      // return promise
      // sign in success -> resolve promise
      // sign in failure -> reject promise with result
      return new Promise((resolve, reject) => {
        this.restClient.GET<Array<VersionedDataTransferObject>>(new UriBuilder().fromPath(this.getUrl()).path('LaufendAbgeschlossen').build())
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
  }


  public findAllSportyearDestinct(): Promise<BogenligaResponse<SportjahrVeranstaltungDO[]>> {
    if (this.onOfflineService.isOffline()) {
      return new Promise((resolve, reject) => {
        const year = this.onOfflineService.getOfflineJahr();
        if (year) {
          resolve({result: RequestResult.SUCCESS, payload: fromOfflineSportjahr(year)});
        } else {
          reject({result: RequestResult.FAILURE});
        }
      });
    } else {
      // return promise
      // sign in success -> resolve promise
      // sign in failure -> reject promise with result
      return new Promise((resolve, reject) => {
        this.restClient.GET<Array<VersionedDataTransferObject>>(new UriBuilder().fromPath(this.getUrl()).path('destinct/sportjahr').build())
            .then((data: VersionedDataTransferObject[]) => {
              resolve({result: RequestResult.SUCCESS, payload: fromPlayloadArraySp(data)});
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

  public findBySportyear(sportjahr: number): Promise<BogenligaResponse<VeranstaltungDO[]>> {
    if (this.onOfflineService.isOffline()) {
      console.log('Choosing offline way for Veranstaltungen findBySportyear with sportjahr:' + sportjahr);
      return new Promise((resolve, reject) => {
        db.veranstaltungTabelle.where('sportjahr').equals(sportjahr).toArray()
          .then((data) => {
            resolve({result: RequestResult.SUCCESS, payload: toDOfromOfflineVeranstaltungArray(data)});
          }, () => {
            reject({result: RequestResult.FAILURE});
          });
      });
    } else {
      // return promise
      // sign in success -> resolve promise
      // sign in failure -> reject promise with result
      return new Promise((resolve, reject) => {
        this.restClient.GET<Array<VersionedDataTransferObject>>(new UriBuilder().fromPath(this.getUrl()).path('find/by/year/' + sportjahr).build())
            .then((data: VersionedDataTransferObject[]) => {
              // console.log(data.toString());
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
  }

  public findBySportyearLaufend(sportjahr: number): Promise<BogenligaResponse<VeranstaltungDO[]>> {
    if (this.onOfflineService.isOffline()) {
      console.log('Choosing offline way for Veranstaltungen findBySportyear with sportjahr:' + sportjahr);
      return new Promise((resolve, reject) => {
        db.veranstaltungTabelle.where('sportjahr').equals(sportjahr).toArray()
          .then((data) => {
            resolve({result: RequestResult.SUCCESS, payload: toDOfromOfflineVeranstaltungArray(data)});
          }, () => {
            reject({result: RequestResult.FAILURE});
          });
      });
    } else {
      // return promise
      // sign in success -> resolve promise
      // sign in failure -> reject promise with result
      return new Promise((resolve, reject) => {
        this.restClient.GET<Array<VersionedDataTransferObject>>(new UriBuilder().fromPath(this.getUrl()).path('find/by/year/' + sportjahr + '/Laufend').build())
            .then((data: VersionedDataTransferObject[]) => {
              // console.log(data.toString());
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
  }

  public findBySportyearGeplantLaufend(sportjahr: number): Promise<BogenligaResponse<VeranstaltungDO[]>> {
    if (this.onOfflineService.isOffline()) {
      console.log('Choosing offline way for Veranstaltungen findBySportyear with sportjahr:' + sportjahr);
      return new Promise((resolve, reject) => {
        db.veranstaltungTabelle.where('sportjahr').equals(sportjahr).toArray()
          .then((data) => {
            resolve({result: RequestResult.SUCCESS, payload: toDOfromOfflineVeranstaltungArray(data)});
          }, () => {
            reject({result: RequestResult.FAILURE});
          });
      });
    } else {
      // return promise
      // sign in success -> resolve promise
      // sign in failure -> reject promise with result
      return new Promise((resolve, reject) => {
        this.restClient.GET<Array<VersionedDataTransferObject>>(new UriBuilder().fromPath(this.getUrl()).path('find/by/year/' + sportjahr + '/GeplantLaufend').build())
            .then((data: VersionedDataTransferObject[]) => {
              // console.log(data.toString());
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
  }

  public findBySportjahrDestinct(sportjahr: number): Promise<BogenligaResponse<VeranstaltungDO[]>> {
    if (this.onOfflineService.isOffline()) {
      console.log('Choosing offline way for Veranstaltungen findBySportjahrDestinct with sportjahr:' + sportjahr);
      return new Promise((resolve, reject) => {
        db.veranstaltungTabelle.where('sportjahr').equals(sportjahr).toArray()
          .catch((error) => {
            console.error('Failed to find VeranstaltungBySportjahrDestinct: ' + error);
            return Promise.reject(error);
          })
          .then((data) => {
            resolve({result: RequestResult.SUCCESS, payload: toDOfromOfflineVeranstaltungArray(data)});
          }, () => {
            reject({result: RequestResult.FAILURE});
          });
      });
    } else {
      // return promise
      // sign in success -> resolve promise
      // sign in failure -> reject promise with result
      return new Promise((resolve, reject) => {
        this.restClient.GET<Array<VersionedDataTransferObject>>(new UriBuilder().fromPath(this.getUrl()).path('find/by/sorted/' + sportjahr).build())
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



  public findById(id: string | number): Promise<BogenligaResponse<VeranstaltungDO>> {
    if (this.onOfflineService.isOffline()) {
      console.log('Choosing offline way for Veranstaltungen with Id: ' + id);
      return new Promise((resolve, reject) => {
        db.veranstaltungTabelle.get(Number(id))
          .then((data: OfflineVeranstaltung) => {
            resolve({result: RequestResult.SUCCESS, payload: toDOfromOfflineVeranstaltung(data)});
          }, () => {
            reject({result: RequestResult.FAILURE});
          });
      });
    } else {
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
  }




  public update(payload: VersionedDataTransferObject): Promise<BogenligaResponse<VeranstaltungDO>> {
    // return promise
    // sign in success -> resolve promise
    // sign in failure -> reject promise with result
    return new Promise((resolve, reject) => {
      this.restClient.PUT<VersionedDataTransferObject>(new UriBuilder().fromPath(this.getUrl()).build(), payload)
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
  public create(payload: VeranstaltungDO): Promise<BogenligaResponse<VeranstaltungDO>> {
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


  public findByLigaId(ligaID: string | number): Promise<BogenligaResponse<VeranstaltungDO[]>> {
    if (this.onOfflineService.isOffline()) {
      console.log('Choosing offline way for Veranstaltungen findByLigaID with ligaId: ' + ligaID);
      return new Promise((resolve, reject) => {
        db.veranstaltungTabelle.where('ligaId').equals(ligaID).toArray()
          .then((data) => {
            resolve({result: RequestResult.SUCCESS, payload: toDOfromOfflineVeranstaltungArray(data)});
          }, () => {
            reject({result: RequestResult.FAILURE});
          });
      });
    } else {
      // return promise
      // sign in success -> resolve promise
      // sign in failure -> reject promise with result
      return new Promise((resolve, reject) => {
        this.restClient.GET<Array<VersionedDataTransferObject>>(new UriBuilder().fromPath(this.getUrl()).path('findByLigaID/' + ligaID).build())
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
  }

  /**
   * returns last Veranstaltung
   * by using current VeranstaltungId
   * @param id
   */
  public findLastVeranstaltungById(id: string | number): Promise<BogenligaResponse<VeranstaltungDO>> {
    // return promise
    // sign in success -> resolve promise
    // sign in failure -> reject promise with result
    return new Promise((resolve, reject) => {
      this.restClient.GET<VersionedDataTransferObject>(new UriBuilder()
        .fromPath(this.getUrl()).path('findLastVeranstaltungBy/' + id).build())
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
