import {ElementRef, Injectable} from '@angular/core';
import {ResourceProviderService} from '../../shared/data-provider/services/resource-provider.service';
import {Response, RestClient, UriBuilder} from '../../shared/data-provider';

@Injectable({
  providedIn: 'root'
})
export class SetzlisteProviderService extends ResourceProviderService {

  serviceSubUrl = 'v1/download';


  constructor(private restClient: RestClient) {
    super();
  }

  public downloadExamplePdf(url: string, fileName: string, aElement: ElementRef): Promise<Response<string>> {
    return this.downloadFile(new UriBuilder().fromPath(this.getUrl()).path(url).build(), fileName, aElement)
  }

  getRestClient(): RestClient {
    return this.restClient;
  }
}
