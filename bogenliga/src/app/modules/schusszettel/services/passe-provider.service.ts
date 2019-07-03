import {Injectable} from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import {
  BogenligaResponse,
  DataProviderService,
  RequestResult,
  RestClient,
  UriBuilder
} from '../../shared/data-provider';
import {SchusszettelMapper} from '../mapper/schusszettel-mapper';
import {PasseDO} from '../types/passe-do.class';
import {PasseDTO} from '../types/datatransfer/passe-dto.class';

@Injectable({
  providedIn: 'root'
})
export class PasseProviderService extends DataProviderService {

  serviceSubUrl = 'v1/passen';

  constructor(private restClient: RestClient) {
    super();
  }

  public get(passeId: string): Promise<BogenligaResponse<PasseDO>> {
    return new Promise((resolve, reject) => {
      this.restClient.GET<PasseDTO>(new UriBuilder().fromPath(this.getUrl()).path(passeId).build())
          .then((data: PasseDTO) => {
            const passeDO = SchusszettelMapper.passeToDO(data);
            resolve({result: RequestResult.SUCCESS, payload: passeDO});
          }, (error: HttpErrorResponse) => {
            if (error.status === 0) {
              reject({result: RequestResult.CONNECTION_PROBLEM});
            } else {
              reject({result: RequestResult.FAILURE});
            }
          });
    });
  }

  public create(passeDO: PasseDO): Promise<BogenligaResponse<PasseDO>> {
    const passeDTO = SchusszettelMapper.passeToDTO(passeDO);
    return new Promise(((resolve, reject) => {
      this.restClient.POST(this.getUrl(), passeDTO)
          .then((data: PasseDTO) => {
            const passeDO = SchusszettelMapper.passeToDO(data);
            resolve({result: RequestResult.SUCCESS, payload: passeDO});
          }, (error: HttpErrorResponse) => {
            if (error.status === 0) {
              reject({result: RequestResult.CONNECTION_PROBLEM});
            } else {
              reject({result: RequestResult.FAILURE});
            }
          });
    }));
  }

  public update(passeDO: PasseDO): Promise<BogenligaResponse<PasseDO>> {
    const passeDTO = SchusszettelMapper.passeToDTO(passeDO);
    return new Promise(((resolve, reject) => {
      this.restClient.PUT(this.getUrl(), passeDTO)
          .then((data: PasseDTO) => {
            const passeDO = SchusszettelMapper.passeToDO(data);
            resolve({result: RequestResult.SUCCESS, payload: passeDO});
          }, (error: HttpErrorResponse) => {
            if (error.status === 0) {
              reject({result: RequestResult.CONNECTION_PROBLEM});
            } else {
              reject({result: RequestResult.FAILURE});
            }
          });
    }));
  }
}
