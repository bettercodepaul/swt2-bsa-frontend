import {ElementRef, Injectable} from '@angular/core';
import {BogenligaResponse, RestClient} from '../../../../data-provider';
import {ResourceProviderService} from '../../../../data-provider/services/resource-provider.service';

@Injectable({
  providedIn: 'root'
})
export class DownloadButtonResourceProviderService extends ResourceProviderService {

  serviceSubUrl = '';


  constructor(private restClient: RestClient) {
    super();
  }

  public download(url: string, fileName: string, aElement: ElementRef): Promise<BogenligaResponse<string>> {
    return this.downloadFile(url, fileName, aElement);
  }

  getRestClient(): RestClient {
    return this.restClient;
  }
}
