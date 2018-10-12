import {Injectable} from '@angular/core';

import {CommonDataProviderService, DataTransferObject, RestClient} from '../../shared/data-provider';
import {CurrentUserService} from '../../shared/services/current-user';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class UserDataProviderService extends CommonDataProviderService {

  serviceSubUrl = 'v1/dsbmitglied';

  constructor(private restClient: RestClient, private currentUserService: CurrentUserService) {
    super();
  }

  addOne(payload: DataTransferObject): Observable<DataTransferObject> {
    return undefined;
  }

  deleteById(key: string | number): Observable<any> {
    return undefined;
  }

  findAll(): Observable<DataTransferObject[]> {
    return this.restClient.GET(this.getUrl());
  }

  findById(key: string | number): Observable<DataTransferObject> {
    return undefined;
  }

  update(payload: DataTransferObject): Observable<DataTransferObject> {
    return undefined;
  }
}
