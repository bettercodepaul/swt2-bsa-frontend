import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {isNullOrUndefined, isUndefined} from '@shared/functions';
import {
  ButtonType,
  CommonComponent, hideLoadingIndicator,
  showDeleteLoadingIndicatorIcon,
  toTableRows
} from '../../../../../shared/components';
import {BogenligaResponse} from '../../../../../shared/data-provider';
import {
  Notification,
  NotificationOrigin,
  NotificationService,
  NotificationSeverity,
  NotificationType,
  NotificationUserAction
} from '../../../../../shared/services/notification';
import {VereinDataProviderService} from '../../../../services/verein-data-provider.service';
import {DsbMitgliedDO} from '../../../../types/dsb-mitglied-do.class';
import {VereinDO} from '../../../../types/verein-do.class';
import {MANNSCHAFT_DETAIL_CONFIG, MANNSCHAFT_DETAIL_TABLE_CONFIG} from './mannschaft-detail.config';
import {DsbMannschaftDO} from '@verwaltung/types/dsb-mannschaft-do.class';
import {DsbMannschaftDataProviderService} from '@verwaltung/services/dsb-mannschaft-data-provider.service';
import {VeranstaltungDO} from '@verwaltung/types/veranstaltung-do.class';
import {VeranstaltungDataProviderService} from '@verwaltung/services/veranstaltung-data-provider.service';
import {DsbMitgliedDataProviderService} from '@verwaltung/services/dsb-mitglied-data-provider.service';
import {TableRow} from '@shared/components/tables/types/table-row.class';
import {VereinDTO} from '@verwaltung/types/datatransfer/verein-dto.class';
import {DsbMitgliedDTO} from '@verwaltung/types/datatransfer/dsb-mitglied-dto.class';
import {MannschaftsmitgliedDataProviderService} from '@verwaltung/services/mannschaftsmitglied-data-provider.service';
import {MannschaftsmitgliedDTO} from '@verwaltung/types/datatransfer/mannschaftsmitglied-dto.class';
import {VersionedDataObject} from '@shared/data-provider/models/versioned-data-object.interface';


const ID_PATH_PARAM = 'id';
const NOTIFICATION_DELETE_MANNSCHAFT = 'mannschaft_detail_delete';
const NOTIFICATION_DELETE_MANNSCHAFT_SUCCESS = 'mannschaft_detail_delete_success';
const NOTIFICATION_DELETE_MANNSCHAFT_FAILURE = 'mannschaft_detail_delete_failure';
const NOTIFICATION_SAVE_MANNSCHAFT = 'mannschaft_detail_save';
const NOTIFICATION_UPDATE_MANNSCHAFT = 'mannschaft_detail_update';

@Component({
  selector:    'bla-mannschaft-detail',
  templateUrl: './mannschaft-detail.component.html',
  styleUrls:   ['./mannschaft-detail.component.scss']
})
export class MannschaftDetailComponent extends CommonComponent implements OnInit {
  public config = MANNSCHAFT_DETAIL_CONFIG;
  public config_table = MANNSCHAFT_DETAIL_TABLE_CONFIG;
  public rows: TableRow[];
  public ButtonType = ButtonType;
  public currentMannschaft: DsbMannschaftDO = new DsbMannschaftDO();
  public currentVerein: VereinDO = new VereinDO();
  public currentVeranstaltung: VeranstaltungDO = new VeranstaltungDO();
  public ligen: Array<VeranstaltungDO> = [new VeranstaltungDO()];

  public deleteLoading = false;
  public saveLoading = false;

  constructor(private mannschaftProvider: DsbMannschaftDataProviderService,
              private vereinProvider: VereinDataProviderService,
              private veranstaltungProvider: VeranstaltungDataProviderService,
              private dsbMitgliedProvider: DsbMitgliedDataProviderService,
              private mannschaftMitgliedProvider: MannschaftsmitgliedDataProviderService,
              private router: Router,
              private route: ActivatedRoute,
              private notificationService: NotificationService) {
    super();
  }

  ngOnInit() {
    this.loading = true;

    this.loadVereinById(Number.parseInt(this.route.snapshot.url[1].path, 10));
    this.loadVeranstaltungen();

    this.notificationService.discardNotification();

    this.route.params.subscribe((params) => {
      if (!isUndefined(params[ID_PATH_PARAM])) {
        const id = params[ID_PATH_PARAM];
        if (id === 'add') {
          this.currentMannschaft = new DsbMannschaftDO();
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

    // persist
    this.currentMannschaft.vereinId = this.currentVerein.id; // Set selected verein id
    this.currentMannschaft.veranstaltungId = this.currentVeranstaltung.id; // set selected veranstaltung id
    this.currentMannschaft.benutzerId = 1;


    console.log('Saving mannschaft: ', this.currentMannschaft);

    this.mannschaftProvider.create(this.currentMannschaft, this.currentVerein)
        .then((response: BogenligaResponse<DsbMannschaftDO>) => {
          if (!isNullOrUndefined(response)
            && !isNullOrUndefined(response.payload)
            && !isNullOrUndefined(response.payload.id)) {
            console.log('Saved with id: ' + response.payload.id);

            const notification: Notification = {
              id:          NOTIFICATION_SAVE_MANNSCHAFT,
              title:       'MANAGEMENT.MANNSCHAFT_DETAIL.NOTIFICATION.SAVE.TITLE',
              description: 'MANAGEMENT.MANNSCHAFT_DETAIL.NOTIFICATION.SAVE.DESCRIPTION',
              severity:    NotificationSeverity.INFO,
              origin:      NotificationOrigin.USER,
              type:        NotificationType.OK,
              userAction:  NotificationUserAction.PENDING
            };

            this.notificationService.observeNotification(NOTIFICATION_SAVE_MANNSCHAFT)
                .subscribe((myNotification) => {
                  if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
                    this.saveLoading = false;
                    this.router.navigateByUrl('/verwaltung/vereine/' + response.payload.vereinId);
                  }
                });

            this.notificationService.showNotification(notification);
          }
        }, (response: BogenligaResponse<DsbMitgliedDO>) => {
          console.log(response.payload);
          console.log('Failed');
          this.saveLoading = false;


        });
    // show response message
  }

  public onUpdate(ignore: any): void {
    this.saveLoading = true;

    // persist
    this.currentMannschaft.vereinId = this.currentVerein.id; // Set selected verein id

    this.mannschaftProvider.update(this.currentMannschaft)
        .then((response: BogenligaResponse<DsbMannschaftDO>) => {
          if (!isNullOrUndefined(response)
            && !isNullOrUndefined(response.payload)
            && !isNullOrUndefined(response.payload.id)) {

            const id = this.currentMannschaft.id;

            const notification: Notification = {
              id:          NOTIFICATION_UPDATE_MANNSCHAFT + id,
              title:       'MANAGEMENT.MANNSCHAFT_DETAIL.NOTIFICATION.SAVE.TITLE',
              description: 'MANAGEMENT.MANNSCHAFT_DETAIL.NOTIFICATION.SAVE.DESCRIPTION',
              severity:    NotificationSeverity.INFO,
              origin:      NotificationOrigin.USER,
              type:        NotificationType.OK,
              userAction:  NotificationUserAction.PENDING
            };

            this.notificationService.observeNotification(NOTIFICATION_UPDATE_MANNSCHAFT + id)
                .subscribe((myNotification) => {
                  if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
                    this.saveLoading = false;
                    this.router.navigateByUrl('/verwaltung/vereine/' + response.payload.vereinId);
                  }
                });

            this.notificationService.showNotification(notification);
          }
        }, (response: BogenligaResponse<DsbMitgliedDO>) => {
          console.log('Failed');
          this.saveLoading = false;
        });
    // show response message
  }

  public onDelete(ignore: any): void {
    this.deleteLoading = true;
    this.notificationService.discardNotification();

    const id = this.currentMannschaft.id;

    const notification: Notification = {
      id:               NOTIFICATION_DELETE_MANNSCHAFT + id,
      title:            'MANAGEMENT.MANNSCHAFT_DETAIL.NOTIFICATION.DELETE.TITLE',
      description:      'MANAGEMENT.MANNSCHAFT_DETAIL.NOTIFICATION.DELETE.DESCRIPTION',
      descriptionParam: '' + id,
      severity:         NotificationSeverity.QUESTION,
      origin:           NotificationOrigin.USER,
      type:             NotificationType.YES_NO,
      userAction:       NotificationUserAction.PENDING
    };

    this.notificationService.observeNotification(NOTIFICATION_DELETE_MANNSCHAFT + id)
        .subscribe((myNotification) => {

          if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
            this.mannschaftProvider.deleteById(id)
                .then((response) => this.handleDeleteSuccess(response))
                .catch((response) => this.handleDeleteFailure(response));
          }
        });

    this.notificationService.showNotification(notification);
  }

  public entityExists(): boolean {
    return this.currentMannschaft.id >= 0;
  }

  private loadById(id: number) {
    this.mannschaftProvider.findById(id)
        .then((response: BogenligaResponse<DsbMannschaftDO>) => this.handleSuccess(response))
        .catch((response: BogenligaResponse<DsbMannschaftDO>) => this.handleFailure(response));
  }

  private loadVereinById(id: number) {
    this.vereinProvider.findById(id)
        .then((response: BogenligaResponse<VereinDO>) => this.handleVereinSuccess(response))
        .catch((response: BogenligaResponse<VereinDO>) => this.handleVereinFailure(response));
  }

  private loadVeranstaltungen() {
    this.veranstaltungProvider.findAll()
        .then((response: BogenligaResponse<VeranstaltungDO[]>) => this.handleVeranstaltungSuccess(response))
        .catch((response: BogenligaResponse<VeranstaltungDO[]>) => this.handleVeranstaltungFailure(response));
  }


  private handleSuccess(response: BogenligaResponse<DsbMannschaftDO>) {
    this.currentMannschaft = response.payload;
    this.loadTableRows();
    this.loading = false;
  }

  private handleFailure(response: BogenligaResponse<DsbMannschaftDO>) {
    this.loading = false;
  }

  private handleVereinSuccess(response: BogenligaResponse<VereinDO>) {
    this.currentVerein = response.payload;
    this.loading = false;
  }

  private handleVereinFailure(response: BogenligaResponse<VereinDO>) {
    this.loading = false;
  }

  private handleVeranstaltungSuccess(response: BogenligaResponse<VeranstaltungDO[]>) {
    this.ligen = [];
    this.ligen = response.payload;
    this.currentVeranstaltung = this.ligen[0];
    this.loading = false;
  }

  private handleVeranstaltungFailure(response: BogenligaResponse<VeranstaltungDO[]>) {
    this.ligen = [];
    this.loading = false;
  }

  private loadTableRows() {
    this.loading = true;

    this.mannschaftMitgliedProvider.findAllByTeamId(this.currentMannschaft.id)
        .then((response: BogenligaResponse<MannschaftsmitgliedDTO[]>) => this.handleLoadTableRowsSuccess(response))
        .catch((response: BogenligaResponse<MannschaftsmitgliedDTO[]>) => this.handleLoadTableRowsFailure(response));
  }

  private handleLoadTableRowsFailure(response: BogenligaResponse<MannschaftsmitgliedDTO[]>): void {
    this.rows = [];
    this.loading = false;
  }

  private handleLoadTableRowsSuccess(response: BogenligaResponse<MannschaftsmitgliedDTO[]>): void {
    this.rows = []; // reset array to ensure change detection
    response.payload.forEach( (member) => this.addMember(member));
    this.loading = false;
  }

  private addMember(member: MannschaftsmitgliedDTO): void {
    this.dsbMitgliedProvider.findById(member.dsbMitgliedId)
      .then((response: BogenligaResponse<DsbMitgliedDTO>) => this.handleAddMemberSuccess(response))
        .catch((response: BogenligaResponse<DsbMitgliedDTO>) => this.handleAddMemberFailure(response));
  }

  private handleAddMemberSuccess(response: BogenligaResponse<DsbMitgliedDTO>) {
    this.rows.push(new TableRow( {payload: response.payload}));
  }

  private handleAddMemberFailure(response: BogenligaResponse<DsbMitgliedDTO>) {
    // do nothing
  }

  public onDeleteMitglied(versionedDataObject: VersionedDataObject): void {

    this.notificationService.discardNotification();

    const id = versionedDataObject.id;
    this.rows = showDeleteLoadingIndicatorIcon(this.rows, id);

    const notification: Notification = {
      id:               NOTIFICATION_DELETE_MANNSCHAFT + id,
      title:            'MANAGEMENT.MANNSCHAFT_DETAIL.NOTIFICATION.DELETE.TITLE',
      description:      'MANAGEMENT.MANNSCHAFT_DETAIL.NOTIFICATION.DELETE.DESCRIPTION',
      descriptionParam: '' + id,
      severity:         NotificationSeverity.QUESTION,
      origin:           NotificationOrigin.USER,
      type:             NotificationType.YES_NO,
      userAction:       NotificationUserAction.PENDING
    };

    this.notificationService.observeNotification(NOTIFICATION_DELETE_MANNSCHAFT + id)
        .subscribe((myNotification) => {

          if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
            // TODO ***********************************************+
            // TODO: Mannschaftsmitglied aus Mannschaft entfernen
            // TODO ***********************************************+
            this.mannschaftMitgliedProvider.deleteById(versionedDataObject.id)
                .then((response) => this.loadTableRows())
                .catch((response) => this.rows = hideLoadingIndicator(this.rows, id));
          } else if (myNotification.userAction === NotificationUserAction.DECLINED) {
            this.rows = hideLoadingIndicator(this.rows, id);
          }

        });

    this.notificationService.showNotification(notification);
  }

  public onView(versionedDataObject: VersionedDataObject): void {
    this.navigateToDetailDialog(versionedDataObject);

  }

  public onEdit(versionedDataObject: VersionedDataObject): void {
    this.navigateToDetailDialog(versionedDataObject);
  }

  private navigateToDetailDialog(versionedDataObject: VersionedDataObject) {
    this.router.navigateByUrl('/verwaltung/vereine/' + this.currentVerein.id + '/' + this.currentMannschaft.id + "/" + versionedDataObject.id);
  }

  private handleDeleteSuccess(response: BogenligaResponse<void>): void {

    const notification: Notification = {
      id:          NOTIFICATION_DELETE_MANNSCHAFT_SUCCESS,
      title:       'MANAGEMENT.MANNSCHAFT_DETAIL.NOTIFICATION.DELETE_SUCCESS.TITLE',
      description: 'MANAGEMENT.MANNSCHAFT_DETAIL.NOTIFICATION.DELETE_SUCCESS.DESCRIPTION',
      severity:    NotificationSeverity.INFO,
      origin:      NotificationOrigin.USER,
      type:        NotificationType.OK,
      userAction:  NotificationUserAction.PENDING
    };

    this.notificationService.observeNotification(NOTIFICATION_DELETE_MANNSCHAFT_SUCCESS)
        .subscribe((myNotification) => {
          if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
            this.router.navigateByUrl('/verwaltung/vereine/' + this.currentMannschaft.vereinId);
            this.deleteLoading = false;
          }
        });

    this.notificationService.showNotification(notification);
  }

  private handleDeleteFailure(response: BogenligaResponse<void>): void {

    const notification: Notification = {
      id:          NOTIFICATION_DELETE_MANNSCHAFT_FAILURE,
      title:       'MANAGEMENT.MANNSCHAFT_DETAIL.NOTIFICATION.DELETE_FAILURE.TITLE',
      description: 'MANAGEMENT.MANNSCHAFT_DETAIL.NOTIFICATION.DELETE_FAILURE.DESCRIPTION',
      severity:    NotificationSeverity.ERROR,
      origin:      NotificationOrigin.USER,
      type:        NotificationType.OK,
      userAction:  NotificationUserAction.PENDING
    };

    this.notificationService.observeNotification(NOTIFICATION_DELETE_MANNSCHAFT_FAILURE)
        .subscribe((myNotification) => {
          if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
            this.deleteLoading = false;
          }
        });

    this.notificationService.showNotification(notification);
  }
}
