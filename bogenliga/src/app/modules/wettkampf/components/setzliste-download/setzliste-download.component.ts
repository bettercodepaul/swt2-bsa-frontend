import {Component, ElementRef, OnInit, ViewChild, Input} from '@angular/core';
import {environment} from '../../../../../environments/environment';
import {BogenligaResponse, UriBuilder} from '../../../shared/data-provider';
import {NotificationService} from '../../../shared/services/notification';
import {
  Notification,
  NotificationOrigin,
  NotificationSeverity,
  NotificationType,
  NotificationUserAction
} from '../../../shared/services/notification/types';
import {SetzlisteProviderService} from '../../services/setzliste-provider.service';

const NOTIFICATION_DOWNLOAD_SUCCESS = 'download_example_success';
const NOTIFICATION_DOWNLOAD_FAILURE = 'download_example_failure';

@Component({
  selector: 'bla-setzliste-download',
  templateUrl: './setzliste-download.component.html'
})
export class SetzlisteDownloadComponent implements OnInit {

  public downloadingFile = false;

  // Get the value of the attribute from the html tag
  @Input()
  wettkampfid: number;

  // Get the value of the attribute from the html tag
  @Input()
  wettkampftag: number;

  @ViewChild('downloadLink')
  private aElementRef: ElementRef;

  constructor(private setzlisteService: SetzlisteProviderService,
              private notificationService: NotificationService) {
  }

  ngOnInit() {
  }

  public getDownloadUrl(path: string): string {
    return new UriBuilder()
      .fromPath(environment.backendBaseUrl)
      .path('v1/download')
      .path(path)
      .path('?wettkampfid=' + this.wettkampfid + '&wettkampftag=' + this.wettkampftag)
      .build();
  }

  public download(fileType: string) {
    this.downloadingFile = true;

    const fileEnding = fileType.toLowerCase();
    const fileName = fileEnding + ' -example.' + fileEnding;

    console.log('Invoke ' + fileType + ' download');

    this.setzlisteService.downloadExamplePdf(fileEnding, fileName, this.aElementRef)
        .then((response) => this.handleSuccess(response, fileType))
        .catch((response) => this.handleFailure(response, fileType));

  }

  private handleSuccess(response: BogenligaResponse<string>, fileType: string): void {

    const notification: Notification = {
      id: NOTIFICATION_DOWNLOAD_SUCCESS,
      title: fileType,
      description: 'Download completed: ' + response.payload,
      severity: NotificationSeverity.INFO,
      origin: NotificationOrigin.USER,
      type: NotificationType.OK,
      userAction: NotificationUserAction.PENDING
    };

    this.notificationService.observeNotification(NOTIFICATION_DOWNLOAD_SUCCESS)
        .subscribe((myNotification) => {
          if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
            console.log('Download ' + fileType + ' from ' + response.payload + ' completed');
            this.downloadingFile = false;
          }
        });

    this.notificationService.showNotification(notification);
  }

  private handleFailure(response: BogenligaResponse<void>, fileType: string): void {

    const notification: Notification = {
      id: NOTIFICATION_DOWNLOAD_FAILURE,
      title: fileType,
      description: 'Download failed',
      severity: NotificationSeverity.ERROR,
      origin: NotificationOrigin.USER,
      type: NotificationType.OK,
      userAction: NotificationUserAction.PENDING
    };

    this.notificationService.observeNotification(NOTIFICATION_DOWNLOAD_FAILURE)
        .subscribe((myNotification) => {
          if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
            console.log('Download ' + fileType + ' failed');
            this.downloadingFile = false;
          }
        });

    this.notificationService.showNotification(notification);
  }
}
