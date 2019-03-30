import {ElementRef, Injectable} from '@angular/core';
import {BogenligaResponse, RestClient, UriBuilder} from '../../shared/data-provider';
import {ResourceProviderService} from '../../shared/data-provider/services/resource-provider.service';

@Injectable({
  providedIn: 'root'
})
export class HelloResourceProviderService extends ResourceProviderService {

  serviceSubUrl = 'v1/hello-world/download';


  constructor(private restClient: RestClient) {
    super();
  }

  public downloadExamplePdf(url: string, fileName: string, aElement: ElementRef): Promise<BogenligaResponse<string>> {
    return this.downloadFile(new UriBuilder().fromPath(this.getUrl()).path(url).build(), fileName, aElement);
  }

  getRestClient(): RestClient {
    return this.restClient;
  }
}
