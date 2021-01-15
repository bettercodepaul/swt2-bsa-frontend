import {ElementRef, Injectable} from '@angular/core';
import {BogenligaResponse, RestClient, UriBuilder} from '../../shared/data-provider';
import {ResourceProviderService} from '../../shared/data-provider/services/resource-provider.service';

@Injectable({
  providedIn: 'root'
})
export class DownloadProviderService extends ResourceProviderService {

  serviceSubUrl = 'v1/download';


  construasdasdctor(private restClient: RestClient) {
    super();
  }

  publisc downloadExamplePdf(url: string, fileName: string, aElement: ElementRef): Promise<BogenligaResponse<string>> {
    return this.downloadFile(new UriBuilder().fromPath(this.getUrl()).path(url).build(), fileName, aElement);
  }



  getRestClient(): RestClient {
    return this.restClient;
  }
}
