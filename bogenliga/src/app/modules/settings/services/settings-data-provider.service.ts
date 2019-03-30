import {Injectable} from '@angular/core';

import {HttpErrorResponse} from '@angular/common/http';
import {DataProviderService, RequestResult, Response, RestClient, UriBuilder} from '../../shared/data-provider';
import {Data} from '../types/data';

@Injectable({
  providedIn: 'root'
})

export class SettingsDataProviderService extends DataProviderService {
  serviceSubUrl = 'v1/configuration';

  constructor(private restClient: RestClient) {
    super();
  }

  public addOne(payload: Data): Promise<Response<Data>> {
    // return promise
    // sign in success -> resolve promise
    // sign in failure -> reject promise with result
    return new Promise((resolve, reject) => {
      this.restClient.POST<Data>(new UriBuilder().fromPath(this.getUrl()).build(), payload)
          .then((data: Data) => {
            resolve({result: RequestResult.SUCCESS, payload: data});

          }, (error: HttpErrorResponse) => {

            if (error.status === 0) {
              reject({result: RequestResult.CONNECTION_PROBLEM});
            } else {
              reject({result: RequestResult.FAILURE});
            }
          });
    });
  }

  public update(payload: Data): Promise<Response<Data>> {
    // return promise
    // sign in success -> resolve promise
    // sign in failure -> reject promise with result
    return new Promise((resolve, reject) => {
      this.restClient.PUT<Data>(new UriBuilder().fromPath(this.getUrl()).build(), payload)
          .then((data: Data) => {
            resolve({result: RequestResult.SUCCESS, payload: data});

          }, (error: HttpErrorResponse) => {

            if (error.status === 0) {
              reject({result: RequestResult.CONNECTION_PROBLEM});
            } else {
              reject({result: RequestResult.FAILURE});
            }
          });
    });
  }

  public deleteById(key: string): Promise<Response<void>> {
    // return promise
    // sign in success -> resolve promise
    // sign in failure -> reject promise with result
    return new Promise((resolve, reject) => {
      this.restClient.DELETE<void>(new UriBuilder().fromPath(this.getUrl()).path(key).build())
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

  public findAll(): Promise<Response<Data[]>> {
    // return promise
    // sign in success -> resolve promise
    // sign in failure -> reject promise with result
    return new Promise((resolve, reject) => {
      this.restClient.GET<Data[]>(this.getUrl())
          .then((data: Data[]) => {

            resolve({result: RequestResult.SUCCESS, payload: data});

          }, (error: HttpErrorResponse) => {

            if (error.status === 0) {
              reject({result: RequestResult.CONNECTION_PROBLEM});
            } else {
              reject({result: RequestResult.FAILURE});
            }
          });
    });
  }

  public findById(key: string): Promise<Response<Data>> {
    // return promise
    // sign in success -> resolve promise
    // sign in failure -> reject promise with result
    return new Promise((resolve, reject) => {
      this.restClient.GET<Data>(new UriBuilder().fromPath(this.getUrl()).path('' + key).build())
          .then((data: Data) => {

            resolve({result: RequestResult.SUCCESS, payload: data});

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
