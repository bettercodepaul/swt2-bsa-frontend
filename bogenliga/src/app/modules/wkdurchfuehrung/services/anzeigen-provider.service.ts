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

  public create(payload: AnzeigenDO): Promise<BogenligaResponse<number>> {
    // return promise
    // sign in success -> resolve promise
    // sign in failure -> reject promise with result
    return new Promise((resolve, reject) => {
      this.restClient.POST<number>(new UriBuilder().fromPath(this.getUrl()).build(), payload)
        .then((data: number) => {
          resolve({result: RequestResult.SUCCESS, payload: data});

        }, (error: HttpErrorResponse) => {

          if (error.status === 0) {
            reject({result: RequestResult.CONNECTION_PROBLEM});
          } else {
            reject({result: RequestResult.FAILURE});
          }
        });
    });
  }

  public update(payload: AnzeigenDO): Promise<BogenligaResponse<MatchDOExt>> {
      const anzeigenDTO = AnzeigenMapperExt.matchToDTO(anzeigenDO);
      return new Promise(((resolve, reject) => {
        this.restClient.PUT(this.getUrl(), anzeigenDTO)
            .then((data: AnzeigenDTOExt) => {
              const updatedAnzeigenDO = AnzeigenMapperExt.matchToDO(data);
              resolve({result: RequestResult.SUCCESS, payload: updatedMatchDO});
            }, (error: HttpErrorResponse) => {
              if (error.status === 0) {
                reject({result: RequestResult.CONNECTION_PROBLEM});
              } else {
                reject({result: RequestResult.FAILURE});
              }
            });
      }));
    }
