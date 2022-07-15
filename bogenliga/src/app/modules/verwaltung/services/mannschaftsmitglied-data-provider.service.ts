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
import {CurrentUserService, OnOfflineService} from '@shared/services';
import {fromPayload, fromPayloadArray} from '../mapper/mannschaftsmitglied-mapper';
import {MannschaftsMitgliedDO} from '../types/mannschaftsmitglied-do.class';
import {db} from '@shared/data-provider/offlinedb/offlinedb';
import {
  fromDOToOfflineMannschaftsmitglied,
  fromOfflineMannschaftsmitgliedToDO,
  fromOfflineMannschaftsmitgliedToDOArray
} from '@verwaltung/mapper/mannschaftsmitglied-offline-mapper';
import {fromOfflineToDsbMitgliedDOArray} from '@verwaltung/mapper/dsb-mitglied-offline.mapper';


/**
 * TODO check usage
 */
@Injectable({
  providedIn: 'root'
})
export class MannschaftsmitgliedDataProviderService extends DataProviderService {

  serviceSubUrl = 'v1/mannschaftsmitglied';

  constructor(private restClient: RestClient, private currentUserService: CurrentUserService, private onOfflineService: OnOfflineService) {
    super();
  }

  public create(payload: MannschaftsMitgliedDO): Promise<BogenligaResponse<MannschaftsMitgliedDO>> {
    if (this.onOfflineService.isOffline()) {
      console.log('Choosing offline way for create Mannschaftsmitglied');
      console.log(payload);
      return new Promise((resolve, reject) => {
        db.transaction('rw', db.mannschaftsmitgliedTabelle, async (tx) => {
          let key = 1;
          await db.mannschaftsmitgliedTabelle.toArray()
            .then((mitglieder) => {
              mitglieder.forEach((mitglied) => {
                if (mitglied.id >= key) {
                  key = mitglied.id + 1;
                }
              });
              console.log(key);
            });
          await db.mannschaftsmitgliedTabelle.put(fromDOToOfflineMannschaftsmitglied(payload, key), key);

          return db.mannschaftsmitgliedTabelle.get(key);
        })
          .then((data) => {
            resolve({result: RequestResult.SUCCESS, payload: fromOfflineMannschaftsmitgliedToDO(data)});
          }, (error) => {
            console.error(error);
            reject({result: RequestResult.FAILURE});
          });
      });
    } else {
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

  // param id: mannschaftsmitglied_id in table mannschaftsmitglied
  public deleteById(id: number): Promise<BogenligaResponse<void>> {
    // return promise
    // sign in success -> resolve promise
    // sign in failure -> reject promise with result
    return new Promise((resolve, reject) => {
      this.restClient.DELETE<void>(new UriBuilder().fromPath(this.getUrl()).path(id).build())
        .then((noData) => {
          resolve({result: RequestResult.SUCCESS});
          console.log('delete Member', id, 'success');

        }, (error: HttpErrorResponse) => {

          if (error.status === 0) {
            reject({result: RequestResult.CONNECTION_PROBLEM});
            console.log('delete Member', id, 'error.status = 0, connection problem');
          } else {
            reject({result: RequestResult.FAILURE});
            console.log('delete Member', id, 'error.status = other, reject');
          }
        });
    });
  }

  // param teamId: mannschaftsmitglied_mannschaft_id
  // param memberId: mannschaftsmitglied_dsb_mitglied_id
  public deleteByMannschaftIdAndDsbMitgliedId(teamId: number, memberId: number): Promise<BogenligaResponse<void>> {
    if (this.onOfflineService.isOffline()) {
      console.log('Choosing offline way for deleteByMannschaftIdAndDsbMitgliedId');
      return new Promise((resolve, reject) => {
        db.transaction('rw', db.mannschaftsmitgliedTabelle, async (tx) => {
          let id: number;
          await db.mannschaftsmitgliedTabelle.where('mannschaftId').equals(teamId).toArray()
                  .then((mitglieder) => {
                    mitglieder.forEach((mitglied) => {
                      if (mitglied.dsbMitgliedId === memberId) {
                        id = mitglied.id;
                      }
                    });
                  });
          db.mannschaftsmitgliedTabelle.delete(id);
        })
          .then((deleted) => {
            console.log(deleted + ' Mitglieder gelöscht');
            resolve({result: RequestResult.SUCCESS});
          })
          .catch((err) => {
            console.log(err);
            reject(err);
          });
      });
    } else {
      // return promise
      // sign in success -> resolve promise
      // sign in failure -> reject promise with result
      return new Promise((resolve, reject) => {
        this.restClient.DELETE<void>(new UriBuilder().fromPath(this.getUrl()).path(teamId + '/' + memberId).build())
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
  }


  public findAll(): Promise<BogenligaResponse<MannschaftsMitgliedDO[]>> {
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


  public findById(id: string | number): Promise<BogenligaResponse<MannschaftsMitgliedDO>> {
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

  public findByMemberId(id: string | number): Promise<BogenligaResponse<MannschaftsMitgliedDO[]>> {
    if (this.onOfflineService.isOffline()) {
      console.log('Choosing offline way for findByMemberId');
      return new Promise((resolve, reject) => {
        db.mannschaftsmitgliedTabelle.where('dsbMitgliedId').equals(id).toArray()
          .then((data) => {
            resolve({result: RequestResult.SUCCESS, payload: fromOfflineMannschaftsmitgliedToDOArray(data)});
          }, () => {
            reject({result: RequestResult.FAILURE});
          });
      });
    } else {
      // return promise
      // sign in success -> resolve promise
      // sign in failure -> resolve promise with result
      return new Promise((resolve, reject) => {
        this.restClient.GET<Array<VersionedDataTransferObject>>(new UriBuilder().fromPath(this.getUrl()).path('byMemberId/' + id).build())
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

  public findByMemberAndTeamId(memberId: string | number, teamId: string | number): Promise<BogenligaResponse<MannschaftsMitgliedDO>> {
    if (this.onOfflineService.isOffline()) {
      console.log('Choosing offline way for findbyMemberAndTeamId: ' + memberId + ', ' + teamId);
      return new Promise((resolve, reject) => {
        let ID: number;
        if (typeof memberId === 'string') {
          ID = parseInt(memberId);
        } else {
          ID = memberId;
        }
        db.mannschaftsmitgliedTabelle.where('mannschaftId').equals(teamId).toArray()
          .then((data) => {
            data.forEach((mitglied) => {
              if (mitglied.id === ID) {
                resolve({result: RequestResult.SUCCESS, payload: fromOfflineMannschaftsmitgliedToDO(mitglied)});
              }
            });
          }, () => {
            reject({result: RequestResult.FAILURE});
          });
      });
    } else {
      // return promise
      // sign in success -> resolve promise
      // sign in failure -> resolve promise with result
      return new Promise((resolve, reject) => {
        this.restClient.GET<VersionedDataTransferObject>(new UriBuilder().fromPath(this.getUrl()).path(memberId).path(teamId).build())
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

  public findByTeamIdAndRueckennummer(teamId: string | number, rueckennummer: string | number): Promise<BogenligaResponse<MannschaftsMitgliedDO>> {
    // return promise
    // sign in success -> resolve promise
    // sign in failure -> resolve promise with result
    return new Promise((resolve, reject) => {
      this.restClient.GET<VersionedDataTransferObject>(new UriBuilder()
        .fromPath(this.getUrl()).path(teamId).path('byRueckennummer').path(rueckennummer).build())
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

  public findAllByTeamId(id: string | number): Promise<BogenligaResponse<MannschaftsMitgliedDO[]>> {
    if (this.onOfflineService.isOffline()) {
      console.log('Choosing offline way for findAllByTeamId');
      return new Promise((resolve, reject) => {
        db.mannschaftsmitgliedTabelle.where('mannschaftId').equals(id).toArray()
          .then((data) => {
            resolve({result: RequestResult.SUCCESS, payload: fromOfflineMannschaftsmitgliedToDOArray(data)});
          }, () => {
            reject({result: RequestResult.FAILURE});
          });
      });
    } else {
      // return promise
      // sign in success -> resolve promise
      // sign in failure -> resolve promise with result
      return new Promise((resolve, reject) => {
        this.restClient.GET<Array<VersionedDataTransferObject>>(new UriBuilder().fromPath(this.getUrl()).path(id).build())
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
  public save(payload: MannschaftsMitgliedDO): Promise<BogenligaResponse<MannschaftsMitgliedDO>> {
    if (this.onOfflineService.isOffline()) {
      console.log('Choosing offline way for findAllByTeamId');
      return new Promise((resolve, reject) => {
        db.transaction('rw', db.mannschaftsmitgliedTabelle, async (tx) => {
          await db.mannschaftsmitgliedTabelle.put(fromDOToOfflineMannschaftsmitglied(payload, payload.id), payload.id);

          return db.mannschaftsmitgliedTabelle.get(payload.id);
        })
          .then((data) => {
            resolve({result: RequestResult.SUCCESS, payload: fromOfflineMannschaftsmitgliedToDO(data)});
          }, () => {
            reject({result: RequestResult.FAILURE});
          });
      });
    } else {
      return new Promise((resolve, reject) => {
        this.restClient.POST<MannschaftsMitgliedDO>(new UriBuilder().fromPath(this.getUrl()).build(), payload)
            .then((data: MannschaftsMitgliedDO) => {
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
  public update(payload: MannschaftsMitgliedDO): Promise<BogenligaResponse<MannschaftsMitgliedDO>> {
    // return promise
    // sign in success -> resolve promise
    // sign in failure -> reject promise with result
    return new Promise((resolve, reject) => {
      this.restClient.PUT<MannschaftsMitgliedDO>(new UriBuilder().fromPath(this.getUrl()).build(), payload)
        .then((data: MannschaftsMitgliedDO) => {
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
