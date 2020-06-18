import {HttpErrorResponse} from '@angular/common/http';
import {ElementRef} from '@angular/core';
import {BogenligaResponse, RequestResult} from '..';
import {DataProviderService} from './data-provider.service';
import {RestClient} from './rest-client.class';

export abstract class ResourceProviderService extends DataProviderService {

  protected constructor() {
    super();
  }

  abstract getRestClient(): RestClient;

  /**
   * Download a resource from a given url with a fileName.
   *
   * @param url to the resource
   * @param fileName of the downloaded file
   * @param targetHtmlLinkElement dynamically extended with the resource url
   */
  public downloadFile(url: string, fileName: string, targetHtmlLinkElement: ElementRef): Promise<BogenligaResponse<string>> {
    return new Promise((resolve, reject) => {
      this.getRestClient().DOWNLOAD(url)
          .then((resource: Blob) => {

            if (this.getWindow().navigator) {

              console.log('Browser navigator information: '
                + JSON.stringify(this.getWindow().navigator.appVersion.toString()));

              // internet explorer
              if (this.getWindow().navigator.msSaveBlob) {

                console.log('IE detected: msSaveBlob');
                this.getWindow().navigator.msSaveBlob(resource, fileName);

              } else if (this.getWindow().navigator.msSaveOrOpenBlob) {

                console.log('IE detected: msSaveOrOpenBlob');
                this.getWindow().navigator.msSaveOrOpenBlob(resource, fileName);

              } else if (this.getWindow().navigator.appVersion.toString().indexOf('.NET') > 0) {
                console.log('IE detected: Open tab');

                const windowWithRawData = this.getWindow().open('#');
                windowWithRawData.document.write('loading...');
                windowWithRawData.location.href = this.getWindow().URL.createObjectURL(resource);

              } else {

                // normal browsers
                console.log('Normal browser detected');

                // simulate click on <a> element
                const link = targetHtmlLinkElement.nativeElement;

                let blobUrl: string;
                blobUrl = this.getWindow().URL.createObjectURL(resource);

                if (fileName.toLowerCase().includes('pdf')) {
                  link.href = blobUrl;
                  link.download = fileName;
                  console.log(link)
                  link.onClick = window.open(blobUrl, '_blank');
                } else {
                  link.href = blobUrl;
                  link.download = fileName;
                  link.click();
                  this.getWindow().URL.revokeObjectURL(blobUrl);
                }

              }

            } else {
              reject({result: RequestResult.FAILURE});
            }


            resolve({result: RequestResult.SUCCESS, payload: url});

          }, (error: HttpErrorResponse) => {

            if (error.status === 0) {
              reject({result: RequestResult.CONNECTION_PROBLEM});
            } else {
              reject({result: RequestResult.FAILURE});
            }
          });
    });
  }

  public downloadMultipleFile(url: string[], fileName: string, targetHtmlLinkElement: ElementRef): Promise<BogenligaResponse<string>> {
    // return new Promise((resolve, reject) => {
    //     this.getRestClient().DOWNLOADMultiple(url)
    //   }
    // );
    console.log("resource-provider-service.ts");
    let result = this.getRestClient().DOWNLOADMultiple(url);
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
    for (let promises of result) {
      promises.then((promise: Blob) => {
        if (this.getWindow().navigator) {
          console.log('Browser navigator information: '
            + JSON.stringify(this.getWindow().navigator.appVersion.toString()));

          // internet explorer
          if (this.getWindow().navigator.msSaveBlob) {

            console.log('IE detected: msSaveBlob');
            this.getWindow().navigator.msSaveBlob(promise, fileName);

          } else if (this.getWindow().navigator.msSaveOrOpenBlob) {

            console.log('IE detected: msSaveOrOpenBlob');
            this.getWindow().navigator.msSaveOrOpenBlob(promise, fileName);

          } else if (this.getWindow().navigator.appVersion.toString().indexOf('.NET') > 0) {
            console.log('IE detected: Open tab');

            const windowWithRawData = this.getWindow().open('#');
            windowWithRawData.document.write('loading...');
            windowWithRawData.location.href = this.getWindow().URL.createObjectURL(promise);

          } else {

            // normal browsers
            console.log('Normal browser detected');

            // simulate click on <a> element
            const link = targetHtmlLinkElement.nativeElement;

            let blobUrl: string;
            blobUrl = this.getWindow().URL.createObjectURL(promise);
            if (fileName.toLowerCase().includes('pdf')) {
              link.href = blobUrl;
              link.download = [fileName.slice(0, 6),
                               "_" + this.makeRandom(10,possible).toLowerCase(),
                               fileName.slice(6)].join('');;
              console.log(link.href);
              link.onClick = window.open(blobUrl, '_blank');
              link.click();
              this.getWindow().URL.revokeObjectURL(blobUrl);
            } else {
              link.href = blobUrl;
              link.download = fileName;
              link.click();
              this.getWindow().URL.revokeObjectURL(blobUrl);
            }

          }
        }
      });
    }
      return new Promise<BogenligaResponse<string>>(null);
  }

  public makeRandom(lengthOfCode: number, possible: string): string {
    let text = "";
    for (let i = 0; i < lengthOfCode; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

    private getWindow(): any {
    return window;
  }
}


