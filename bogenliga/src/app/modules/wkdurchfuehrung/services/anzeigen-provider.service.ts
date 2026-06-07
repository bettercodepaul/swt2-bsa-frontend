import {Injectable} from '@angular/core';
import {
  DataProviderService,
  RestClient
} from '@shared/data-provider';


@Injectable({
  providedIn: 'root'
})
export class AnzeigenProviderService extends DataProviderService {

  serviceSubUrl = 'v1/anzeigen';


  constructor(private restClient: RestClient) {
    super();
  }

}
