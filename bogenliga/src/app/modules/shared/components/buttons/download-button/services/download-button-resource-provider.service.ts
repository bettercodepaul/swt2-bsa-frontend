import {ElementRef, Injectable} from '@angular/core';
import {ResourceProviderService} from '../../../../data-provider/services/resource-provider.service';
import {Response, RestClient} from '../../../../data-provider';

@Injectable({
  providedIn: 'root'
})
export class DownloadButtonResourceProviderService extends ResourceProviderService {

  serviceSubUrl = '';


  constructor(private restClient: RestClient) {
    super();
  }

  public download(url: string, fileName: string, aElement: ElementRef): Promise<Response<string>> {
    return this.downloadFile(url, fileName, aElement)
  }

  getRestClient(): RestClient {
    return this.restClient;
  }
}
