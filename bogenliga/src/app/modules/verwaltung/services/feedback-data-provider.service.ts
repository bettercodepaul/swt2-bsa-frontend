import {HttpErrorResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {
  BogenligaResponse,
  DataProviderService,
  RequestResult,
  RestClient,
  UriBuilder,
  VersionedDataTransferObject
} from '../../shared/data-provider';
import {CurrentUserService} from '../../shared/services/current-user';
import {fromPayload, fromPayloadArray} from '../mapper/feedback-mapper';
import {FeedbackDO} from '../types/feedback-do.class';


@Injectable({
  providedIn: 'root'
})
export class FeedbackProviderService  extends DataProviderService {
  serviceSubUrl = 'v1/feedback';


  constructor(private restClient: RestClient, private currentUserService: CurrentUserService) {
    super();
  }

  public sendFeedback(feedback: string): void {
      this.restClient.GET<void>(new UriBuilder().fromPath(this.getUrl()).path(feedback).build());
  }

}
