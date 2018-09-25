import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';

import { Data } from './../types/data';
import { DATA } from './../mock-data';
import {CommonDataService} from './common-data-provider.service';
import {RestClient} from './rest-client.class';
import {UriBuilder} from '../types/uri-builder.class';

@Injectable({
  providedIn: 'root'
})
export class DataService extends CommonDataService {

  indexSelectedData = -1;

  serviceSubUrl = 'settings';

  constructor(private restClient: RestClient) {
    super();
  }

  getData(): Observable<Data[]> {
    return of(DATA);
  }

  getIndexSelectedData(): number {
    return this.indexSelectedData;
  }

  setIndexSelectedData(index: number) {
    this.indexSelectedData = index;
  }

  addOne(data: Data): Observable<any> {
    return this.restClient.POST(new UriBuilder()
      .fromPath(this.getUrl())
      .path('' + data)
      .build(), data );
  }

  changeByKey(key: string): Observable<any> {
    return ; // PUT
  }

  deleteByKey(key: string): Observable<any> {
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

  findByKey(key: string): Observable<Data> {
    return this.restClient.GET(
      new UriBuilder()
        .fromPath(this.getUrl())
        .path('' + key)
        .build()
    );
  }
}
