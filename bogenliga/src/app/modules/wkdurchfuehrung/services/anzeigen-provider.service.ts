import {HttpErrorResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {
  BogenligaResponse,
  DataProviderService,
  RequestResult,
  RestClient,
  UriBuilder
} from '@shared/data-provider';
import {AnzeigenDO} from '@wkdurchfuehrung/types/anzeige-do.class';


@Injectable({
  providedIn: 'root'
})
export class AnzeigenProviderService extends DataProviderService {

  serviceSubUrl = 'v1/anzeigen';


  constructor(private restClient: RestClient) {
    super();
  }

}
