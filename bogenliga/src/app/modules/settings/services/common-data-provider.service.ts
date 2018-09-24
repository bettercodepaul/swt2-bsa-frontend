import { Injectable } from '@angular/core';

import { Data } from '../types/Data';
import { UriBuilder } from '../types/uri-builder.class';
import { DataServiceConfig } from './../types/data-service-config.interface';

import { Observable } from 'rxjs';

export abstract class CommonDataService {
  abstract serviceSubUrl: string;
  dataServiceConfig: DataServiceConfig;

  constructor() {
    this.dataServiceConfig = {
      baseUrl: 'localhost:9000'
    };
  }

  /**
   * return <BASE_URL>/<SERVICE_SUB_URL>
   */
  getUrl(): string {
    return new UriBuilder()
      .fromPath(this.dataServiceConfig.baseUrl)
      .path(this.serviceSubUrl)
      .build();
  }

  abstract findAll(): Observable<Data[]>;
  abstract findByKey(key: string): Observable<Data>;
  abstract deleteByKey(key: string): Observable<any>;
  abstract changeByKey(key: string): Observable<any>;
  abstract addOne(data: Data): Observable<any>;
}
