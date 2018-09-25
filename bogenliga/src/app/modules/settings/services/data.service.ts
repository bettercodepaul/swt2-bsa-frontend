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
