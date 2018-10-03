import {Injectable} from '@angular/core';

import {Observable} from 'rxjs';

import {Data} from '../types/data';
import {CommonDataProviderService, RestClient, UriBuilder} from '../../shared/data-provider';

@Injectable({
  providedIn: 'root'
})

export class DataService extends CommonDataProviderService {
  serviceSubUrl = 'v1/configuration';

  constructor(private restClient: RestClient) {
    super();
  }

  addOne(data: Data): Observable<any> {
    return this.restClient.POST(new UriBuilder()
      .fromPath(this.getUrl())
      .build(), data );
  }

  update(data: Data): Observable<any> {
    return this.restClient.PUT(
      new UriBuilder()
        .fromPath(this.getUrl())
        .build(), data);
  }

  deleteById(key: string): Observable<any> {
    return this.restClient.DELETE(
      new UriBuilder()
        .fromPath(this.getUrl())
        .path('' + key)
        .build()
    );
  }

  findAll(): Observable<Data[]> {
    return this.restClient.GET(this.getUrl());
  }

  findById(key: string): Observable<Data> {
    return this.restClient.GET(
      new UriBuilder()
        .fromPath(this.getUrl())
        .path('' + key)
        .build()
    );
  }
}
