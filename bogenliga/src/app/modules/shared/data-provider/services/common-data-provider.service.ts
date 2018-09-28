import { Injectable } from '@angular/core';

import { Data } from '../../../settings/types/data';
import { UriBuilder } from '../../../settings/types/uri-builder.class';
import { DataServiceConfig } from '../../../settings/types/data-service-config.interface';

import {Observable, throwError} from 'rxjs';
import {TransferObject} from '../models/transfer-object.interface';
import {HttpErrorResponse} from '@angular/common/http';

export abstract class CommonDataService {
  abstract serviceSubUrl: string;
  dataServiceConfig: DataServiceConfig;

  constructor() {
    this.dataServiceConfig = {
      baseUrl: 'http://localhost:9000'
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
  abstract findById(key: string | number): Observable<any>;
  abstract deleteById(key: string | number): Observable<any>;
  abstract update(payload: TransferObject): Observable<any>;
  abstract addOne(payload: TransferObject): Observable<any>;


}


