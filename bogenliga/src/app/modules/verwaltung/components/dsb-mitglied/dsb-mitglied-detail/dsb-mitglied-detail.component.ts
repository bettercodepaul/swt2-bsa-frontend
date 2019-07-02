import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {isNullOrUndefined, isUndefined} from '@shared/functions';
import {ButtonType, CommonComponent} from '../../../../shared/components';
import {BogenligaResponse, RequestResult} from '../../../../shared/data-provider';
import {
  Notification,
  NotificationOrigin,
  NotificationService,
  NotificationSeverity,
  NotificationType,
  NotificationUserAction
} from '../../../../shared/services/notification';
import {DsbMitgliedDataProviderService} from '../../../services/dsb-mitglied-data-provider.service';
import {DsbMitgliedDO} from '../../../types/dsb-mitglied-do.class';
import {DSB_MITGLIED_DETAIL_CONFIG} from './dsb-mitglied-detail.config';
import {VereinDO} from '@vereine/types/verein-do.class';
import {RegionDO} from '@verwaltung/types/region-do.class';
import {VereinDTO} from '@vereine/types/datatransfer/verein-dto.class';
import {VereinDataProviderService} from '@vereine/services/verein-data-provider.service';
import {HttpClient} from '@angular/common/http';
const ID_PATH_PARAM = 'id';
const NOTIFICATION_DELETE_DSB_MITGLIED = 'dsb_mitglied_detail_delete';
const NOTIFICATION_DELETE_DSB_MITGLIED_SUCCESS = 'dsb_mitglied_detail_delete_success';
const NOTIFICATION_DELETE_DSB_MITGLIED_FAILURE = 'dsb_mitglied_detail_delete_failure';
const NOTIFICATION_SAVE_DSB_MITGLIED = 'dsb_mitglied_detail_save';
const NOTIFICATION_UPDATE_DSB_MITGLIED = 'dsb_mitglied_detail_update';
const NOTIFICATION_DUPLICATE_DSB_MITGLIED = 'dsb_mitglied_detail_duplicate';

@Component({
  selector: 'bla-dsb-mitglied-detail',
  templateUrl: './dsb-mitglied-detail.component.html',
  styleUrls: ['./dsb-mitglied-detail.component.scss']
})
export class DsbMitgliedDetailComponent extends CommonComponent implements OnInit {

  public config = DSB_MITGLIED_DETAIL_CONFIG;
  public ButtonType = ButtonType;
  public currentMitglied: DsbMitgliedDO = new DsbMitgliedDO();
  public currentVerein: VereinDO = new VereinDO();
 // public vereine: Array<VereinDO> = [new VereinDO()];
  public vereine: VereinDO[];
  // public currentVerein: VereinDO;

  public dsbMitgliedNationalitaet: string[];
  public loadingVereine = true;

  public vereineLoaded;

  public  nationen: Array<string> = [];
  public  nationenKuerzel: Array<string> = [];
  public currentMitgliedNat: string;
  public deleteLoading = false;
  public saveLoading = false;

  constructor(private dsbMitgliedDataProvider: DsbMitgliedDataProviderService,
              private router: Router,
              private route: ActivatedRoute,
              private vereinDataProvider: VereinDataProviderService,
              private httpService: HttpClient,
              private notificationService: NotificationService) {
    super();
  }

  ngOnInit() {
    this.loading = true;
    this.loadVereine();
    this.notificationService.discardNotification();

    this.httpService.get('./assets/i18n/Nationalitaeten.json').subscribe(
      (data) => {
      const json = JSON.parse(JSON.stringify(data));
      json['NATIONEN'].forEach( (t) => {
        this.nationen.push(t['name']);
      });

      json['NATIONEN'].forEach( (t) => {
        this.nationenKuerzel.push(t['code']);
       });
      }
    ),

    this.route.params.subscribe((params) => {
      if (!isUndefined(params[ID_PATH_PARAM])) {
        const id = params[ID_PATH_PARAM];
        if (id === 'add') {
          this.currentMitglied = new DsbMitgliedDO();
          this.loading = false;
          this.deleteLoading = false;
          this.saveLoading = false;
        } else {
          this.loadById(params[ID_PATH_PARAM]);
        }
      }
    });

  }

  public onSave(ignore: any): void {
    this.saveLoading = true;
    this.currentMitglied.mitgliedsnummer = this.currentMitglied.mitgliedsnummer.replace(/[' ']/g, '');

    this.currentMitglied.vereinsId = this.currentVerein.id;

    console.log('current nation: ' + this.currentMitgliedNat);

    for (let i = 0; i < this.nationen.length; i++) {
      if (this.nationen[i] === this.currentMitgliedNat) {
        this.currentMitglied.nationalitaet = this.nationenKuerzel[i];
      }
    }

    // persist
    this.dsbMitgliedDataProvider.create(this.currentMitglied)
        .then((response: BogenligaResponse<DsbMitgliedDO>) => {
          if (!isNullOrUndefined(response)
            && !isNullOrUndefined(response.payload)
            && !isNullOrUndefined(response.payload.id)) {
            console.log('Saved with id: ' + response.payload.id);

            const notification: Notification = {
              id: NOTIFICATION_SAVE_DSB_MITGLIED,
              title: 'MANAGEMENT.DSBMITGLIEDER_DETAIL.NOTIFICATION.SAVE.TITLE',
              description: 'MANAGEMENT.DSBMITGLIEDER_DETAIL.NOTIFICATION.SAVE.DESCRIPTION',
              severity: NotificationSeverity.INFO,
              origin: NotificationOrigin.USER,
              type: NotificationType.OK,
              userAction: NotificationUserAction.PENDING
            };

            this.notificationService.observeNotification(NOTIFICATION_SAVE_DSB_MITGLIED)
                .subscribe((myNotification) => {
                  if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
                    this.saveLoading = false;
                    this.router.navigateByUrl('/verwaltung/dsbmitglieder');
                  }
                });

            this.notificationService.showNotification(notification);
          }
        }, (response: BogenligaResponse<DsbMitgliedDO>) => {
          console.log('Failed');
          if (response.result === RequestResult.DUPLICATE_DETECTED) {
            const notification: Notification = {
              id: NOTIFICATION_DUPLICATE_DSB_MITGLIED,
              title: 'MANAGEMENT.DSBMITGLIEDER_DETAIL.NOTIFICATION.DUPLICATE.TITLE',
              description: 'MANAGEMENT.DSBMITGLIEDER_DETAIL.NOTIFICATION.DUPLICATE.DESCRIPTION',
              severity: NotificationSeverity.INFO,
              origin: NotificationOrigin.USER,
              type: NotificationType.OK,
              userAction: NotificationUserAction.PENDING
            };

            this.notificationService.observeNotification(NOTIFICATION_DUPLICATE_DSB_MITGLIED)
                .subscribe((myNotification) => {
                });

            this.notificationService.showNotification(notification);
          }
          this.saveLoading = false;


        });
    // show response message
  }

  public onUpdate(ignore: any): void {
    this.saveLoading = true;
    this.currentMitglied.mitgliedsnummer = this.currentMitglied.mitgliedsnummer.replace(/[' ']/g, '');

    this.currentMitglied.vereinsId = this.currentVerein.id;

    for (let i = 0; i < this.nationen.length; i++) {
      if (this.nationen[i] === this.currentMitgliedNat) {
        this.currentMitglied.nationalitaet = this.nationenKuerzel[i];
      }
    }

    // persist
    this.dsbMitgliedDataProvider.update(this.currentMitglied)
        .then((response: BogenligaResponse<DsbMitgliedDO>) => {
          if (!isNullOrUndefined(response)
            && !isNullOrUndefined(response.payload)
            && !isNullOrUndefined(response.payload.id)) {

            const id = this.currentMitglied.id;

            const notification: Notification = {
              id: NOTIFICATION_UPDATE_DSB_MITGLIED + id,
              title: 'MANAGEMENT.DSBMITGLIEDER_DETAIL.NOTIFICATION.SAVE.TITLE',
              description: 'MANAGEMENT.DSBMITGLIEDER_DETAIL.NOTIFICATION.SAVE.DESCRIPTION',
              severity: NotificationSeverity.INFO,
              origin: NotificationOrigin.USER,
              type: NotificationType.OK,
              userAction: NotificationUserAction.PENDING
            };

            this.notificationService.observeNotification(NOTIFICATION_UPDATE_DSB_MITGLIED + id)
                .subscribe((myNotification) => {
                  if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
                    this.saveLoading = false;
                    this.router.navigateByUrl('/verwaltung/dsbmitglieder');
                  }
                });

            this.notificationService.showNotification(notification);
          }
        }, (response: BogenligaResponse<DsbMitgliedDO>) => {
          console.log('Failed');
          this.saveLoading = false;
          if (response.result === RequestResult.DUPLICATE_DETECTED) {
            const notification: Notification = {
              id: NOTIFICATION_DUPLICATE_DSB_MITGLIED,
              title: 'MANAGEMENT.DSBMITGLIEDER_DETAIL.NOTIFICATION.DUPLICATE.TITLE',
              description: 'MANAGEMENT.DSBMITGLIEDER_DETAIL.NOTIFICATION.DUPLICATE.DESCRIPTION',
              severity: NotificationSeverity.INFO,
              origin: NotificationOrigin.USER,
              type: NotificationType.OK,
              userAction: NotificationUserAction.PENDING
            };

            this.notificationService.observeNotification(NOTIFICATION_DUPLICATE_DSB_MITGLIED)
                .subscribe((myNotification) => {
                });

            this.notificationService.showNotification(notification);
          }
          this.saveLoading = false;
        });
    // show response message
  }

  public onDelete(ignore: any): void {
    this.deleteLoading = true;
    this.notificationService.discardNotification();

    const id = this.currentMitglied.id;

    const notification: Notification = {
      id: NOTIFICATION_DELETE_DSB_MITGLIED + id,
      title: 'MANAGEMENT.DSBMITGLIEDER_DETAIL.NOTIFICATION.DELETE.TITLE',
      description: 'MANAGEMENT.DSBMITGLIEDER_DETAIL.NOTIFICATION.DELETE.DESCRIPTION',
      descriptionParam: '' + id,
      severity: NotificationSeverity.QUESTION,
      origin: NotificationOrigin.USER,
      type: NotificationType.YES_NO,
      userAction: NotificationUserAction.PENDING
    };

    this.notificationService.observeNotification(NOTIFICATION_DELETE_DSB_MITGLIED + id)
        .subscribe((myNotification) => {

          if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
            this.dsbMitgliedDataProvider.deleteById(id)
                .then((response) => this.handleDeleteSuccess(response))
                .catch((response) => this.handleDeleteFailure(response));
          }
        });

    this.notificationService.showNotification(notification);
  }

  public entityExists(): boolean {
    return this.currentMitglied.id >= 0;
  }

  private loadById(id: number) {
    this.dsbMitgliedDataProvider.findById(id)
        .then((response: BogenligaResponse<DsbMitgliedDO>) => this.handleSuccess(response))
        .catch((response: BogenligaResponse<DsbMitgliedDO>) => this.handleFailure(response));
  }

  private handleSuccess(response: BogenligaResponse<DsbMitgliedDO>) {
    this.currentMitglied = response.payload;
    this.loading = false;
    const kuer = this.currentMitglied.nationalitaet;
    for (let i = 0; i < this.nationenKuerzel.length; i++) {
      if (this.nationenKuerzel[i] === kuer) {
        this.currentMitgliedNat = this.nationen[i].toString();
      }
    }
    this.vereine.forEach((verein) => {
      if (verein.id === this.currentMitglied.vereinsId) {
        this.currentVerein = verein;
      }
    });
  }

  private handleFailure(response: BogenligaResponse<DsbMitgliedDO>) {
    this.loading = false;

  }

  private handleDeleteSuccess(response: BogenligaResponse<void>): void {

    const notification: Notification = {
      id: NOTIFICATION_DELETE_DSB_MITGLIED_SUCCESS,
      title: 'MANAGEMENT.DSBMITGLIEDER_DETAIL.NOTIFICATION.DELETE_SUCCESS.TITLE',
      description: 'MANAGEMENT.DSBMITGLIEDER_DETAIL.NOTIFICATION.DELETE_SUCCESS.DESCRIPTION',
      severity: NotificationSeverity.INFO,
      origin: NotificationOrigin.USER,
      type: NotificationType.OK,
      userAction: NotificationUserAction.PENDING
    };

    this.notificationService.observeNotification(NOTIFICATION_DELETE_DSB_MITGLIED_SUCCESS)
        .subscribe((myNotification) => {
          if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
            this.router.navigateByUrl('/verwaltung/dsbmitglieder');
            this.deleteLoading = false;
          }
        });

    this.notificationService.showNotification(notification);
  }

  private handleDeleteFailure(response: BogenligaResponse<void>): void {

    const notification: Notification = {
      id: NOTIFICATION_DELETE_DSB_MITGLIED_FAILURE,
      title: 'MANAGEMENT.DSBMITGLIEDER_DETAIL.NOTIFICATION.DELETE_FAILURE.TITLE',
      description: 'MANAGEMENT.DSBMITGLIEDER_DETAIL.NOTIFICATION.DELETE_FAILURE.DESCRIPTION',
      severity: NotificationSeverity.ERROR,
      origin: NotificationOrigin.USER,
      type: NotificationType.OK,
      userAction: NotificationUserAction.PENDING
    };

    this.notificationService.observeNotification(NOTIFICATION_DELETE_DSB_MITGLIED_FAILURE)
        .subscribe((myNotification) => {
          if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
            this.deleteLoading = false;
          }
        });

    this.notificationService.showNotification(notification);
  }
  private loadVereine(): void {
    this.vereine = [];
    this.vereinDataProvider.findAll()
        .then((response: BogenligaResponse<VereinDTO[]>) =>{this.vereine = response.payload;  this.loadingVereine = false; this.vereineLoaded = true; })
        .catch((response: BogenligaResponse<VereinDTO[]>) => {this.vereine = response.payload; });
  }
}
