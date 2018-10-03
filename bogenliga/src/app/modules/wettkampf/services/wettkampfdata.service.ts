import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Data} from '../../settings/types/data';
import {Wettkampf} from '../types/wettkampf';
import {CommonDataProviderService, RestClient, UriBuilder} from '../../shared/data-provider';

@Injectable({
  providedIn: 'root'
})
export class WettkampfdataService extends CommonDataProviderService {
  serviceSubUrl: string;

  constructor(private restClient: RestClient) {
    super();
  }

  addOne(data: Wettkampf): Observable<any> {
    return this.restClient.POST(new UriBuilder()
      .fromPath(this.getUrl())
      .build(), data );
  }

  update(data: Wettkampf): Observable<any> {
    return this.restClient.PUT(
      new UriBuilder()
        .fromPath(this.getUrl())
        .build(), data);
  }

  deleteById(id: number): Observable<any> {
    return this.restClient.DELETE(
      new UriBuilder()
        .fromPath(this.getUrl())
        .path('' + id)
        .build()
    );
  }

  findAll(): Observable<Data[]> {
    return this.restClient.GET(this.getUrl());
  }

  findById(id: number): Observable<Data> {
    return this.restClient.GET(
      new UriBuilder()
        .fromPath(this.getUrl())
        .path('' + id)
        .build()
    );
  }
}
