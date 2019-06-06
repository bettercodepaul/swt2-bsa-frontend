import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {isNullOrUndefined, isUndefined} from '@shared/functions';
import {
  ButtonType,
  CommonComponent, hideLoadingIndicator,
  showDeleteLoadingIndicatorIcon,
  toTableRows
} from '../../../../../../shared/components';
import {BogenligaResponse} from '../../../../../../shared/data-provider';
import {
  Notification,
  NotificationOrigin,
  NotificationService,
  NotificationSeverity,
  NotificationType,
  NotificationUserAction
} from '../../../../../../shared/services/notification';
import {DsbMitgliedDO} from '../../../../../types/dsb-mitglied-do.class';
import {SCHUETZE_TABLE_CONFIG, SCHUETZEN_CONFIG} from './schuetzen.config';
import {DsbMannschaftDO} from '@verwaltung/types/dsb-mannschaft-do.class';
import {DsbMannschaftDataProviderService} from '@verwaltung/services/dsb-mannschaft-data-provider.service';
import {DsbMitgliedDataProviderService} from '@verwaltung/services/dsb-mitglied-data-provider.service';
import {TableRow} from '@shared/components/tables/types/table-row.class';
import {MannschaftsmitgliedDataProviderService} from '@verwaltung/services/mannschaftsmitglied-data-provider.service';
import {MannschaftsMitgliedDO} from '@verwaltung/types/mannschaftsmitglied-do.class';
import {DsbMitgliedDTO} from '@user/types/model/dsb-mitglied-dto.class';
import {VereinDO} from '@verwaltung/types/verein-do.class';
import {VereinDataProviderService} from '@verwaltung/services/verein-data-provider.service';
import {VersionedDataObject} from '@shared/data-provider/models/versioned-data-object.interface';
import {VereinDTO} from '@verwaltung/types/datatransfer/verein-dto.class';


const ID_PATH_PARAM = 'id';
const NOTIFICATION_SAVE_SCHUETZE = 'schütze_hinzufügen_save';

@Component({
  selector:    'bla-schuetzen',
  templateUrl: './schuetzen.component.html',
  styleUrls:   ['./schuetzen.component.scss']
})
export class SchuetzenComponent extends CommonComponent implements OnInit {
  public config = SCHUETZEN_CONFIG;
  public table_config = SCHUETZE_TABLE_CONFIG;
  public rows: TableRow[];
  public ButtonType = ButtonType;
  public currentMannschaft: DsbMannschaftDO = new DsbMannschaftDO();
  public selectedMember: DsbMitgliedDO = new DsbMitgliedDO();
  public memberToAdd: MannschaftsMitgliedDO = new MannschaftsMitgliedDO();
  public members: DsbMitgliedDTO[] = [new DsbMitgliedDTO()];

  // attributes for the filter of the members
  public vorname = '';
  public nachname = '';
  public mitgliedsnummer = '';
  public currentVerein: VereinDO = new VereinDO();


  public deleteLoading = false;
  public saveLoading = false;

  constructor(private mannschaftProvider: DsbMannschaftDataProviderService,
              private dsbMitgliedProvider: DsbMitgliedDataProviderService,
              private mannschaftMitgliedProvider: MannschaftsmitgliedDataProviderService,
              private vereineProvider: VereinDataProviderService,
              private router: Router,
              private route: ActivatedRoute,
              private notificationService: NotificationService) {
    super();
  }

  ngOnInit() {
    this.loading = true;

    console.log(Number.parseInt(this.route.snapshot.url[2].path, 10));
    console.log(Number.parseInt(this.route.snapshot.url[1].path, 10));

    this.loadMannschaftById(Number.parseInt(this.route.snapshot.url[2].path, 10));
    this.loadVereinById(Number.parseInt(this.route.snapshot.url[1].path, 10));


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
          // this.loadById(params[ID_PATH_PARAM]);
        }
      }
    });
  }

  public onSave(member: VersionedDataObject): void {
    this.saveLoading = true;

    console.log('Saving Schütze: ' + member + ' zu Mannschaft: ', this.currentMannschaft);

    this.memberToAdd.dsbMitgliedId = member.id;
    this.memberToAdd.mannschaftsId = this.currentMannschaft.id;
    // this.memberToAdd.dsbMitgliedEingesetzt = 0;

    this.mannschaftMitgliedProvider.findByMemberId(member.id)
        .then((response: BogenligaResponse<MannschaftsMitgliedDO[]>) => {
          if (response.payload.length <= 1) {
            this.memberToAdd.dsbMitgliedEingesetzt = response.payload.length;

            console.log('saving ' + this.memberToAdd + ' in Mannschaft');

            this.mannschaftMitgliedProvider.create(this.memberToAdd)
                .then((response: BogenligaResponse<MannschaftsMitgliedDO>) => {
                  if (!isNullOrUndefined(response)
                    && !isNullOrUndefined(response.payload)
                    && !isNullOrUndefined(response.payload.id)) {
                    console.log('Saved with id: ' + response.payload.id);

                    const notification: Notification = {
                      id:          NOTIFICATION_SAVE_SCHUETZE,
                      title:       'MANAGEMENT.SCHUETZE_HINZUFUEGEN.NOTIFICATION.SAVE.TITLE',
                      description: 'MANAGEMENT.SCHUETZE_HINZUFUEGEN.NOTIFICATION.SAVE.DESCRIPTION',
                      severity:    NotificationSeverity.INFO,
                      origin:      NotificationOrigin.USER,
                      type:        NotificationType.OK,
                      userAction:  NotificationUserAction.PENDING
                    };

                    this.notificationService.observeNotification(NOTIFICATION_SAVE_SCHUETZE)
                        .subscribe((myNotification) => {
                          if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
                            this.saveLoading = false;
                            this.router.navigateByUrl('/verwaltung/vereine/' + this.currentVerein.id
                              + '/' + this.currentMannschaft.id + '/add');
                          }
                        });

                    this.notificationService.showNotification(notification);
                  }
                }, (response: BogenligaResponse<MannschaftsMitgliedDO>) => {
                  console.log(response.payload);
                  console.log('Failed');
                  this.saveLoading = false;
                });
          }
    }).catch((response: BogenligaResponse<MannschaftsMitgliedDO[]>) => {
      console.log('Failure');
    });


    // show response message
  }

  public onSearch() {
     const filteredMembers = this.members.filter((member) => {
        return (member.vorname.startsWith(this.vorname) || this.vorname.length === 0)
        && (member.nachname.startsWith(this.nachname) || this.nachname.length === 0)
        && (member.mitgliedsnummer.startsWith(this.mitgliedsnummer) || this.mitgliedsnummer.length === 0);
    });
      this.rows = toTableRows(filteredMembers);
  }

  // sets the current Mannschaft, to which the User wants to add the member
  private loadMannschaftById(id: number) {
    this.mannschaftProvider.findById(id)
        .then((response: BogenligaResponse<DsbMannschaftDO>) => this.handleMannschaftSuccess(response))
        .catch((response: BogenligaResponse<DsbMannschaftDO>) => this.handleMannschaftFailure(response));
  }

  private handleMannschaftSuccess(response: BogenligaResponse<DsbMannschaftDO>) {
    this.currentMannschaft = response.payload;
    this.loading = false;
    console.log(this.currentMannschaft);
    this.loadTableRows();
  }

  private handleMannschaftFailure(response: BogenligaResponse<DsbMannschaftDO>) {
    this.loading = false;
  }

  private loadTableRows() {
    this.loading = true;

    this.dsbMitgliedProvider.findAll()
        .then((response: BogenligaResponse<DsbMitgliedDTO[]>) => this.handleTableRowSuccess(response))
      .catch((response: BogenligaResponse<DsbMitgliedDTO[]>) => this.handleTableRowFailure(response));
  }

  private handleTableRowSuccess(response: BogenligaResponse<DsbMitgliedDTO[]>) {
    this.rows = [];
    this.members = [];
    this.members = response.payload;
    this.rows = toTableRows(response.payload);
    this.loading = false;
  }

  private handleTableRowFailure(response: BogenligaResponse<DsbMitgliedDTO[]>) {
    this.rows = [];
    this.loading = false;
  }

  private loadVereinById(id: number) {
    this.loading = true;
    this.vereineProvider.findById(id)
        .then((response: BogenligaResponse<VereinDTO>) => this.handleVereinSuccess(response))
        .catch((response: BogenligaResponse<VereinDTO>) => this.handleVereinFailure(response));
  }

  private handleVereinSuccess(response: BogenligaResponse<VereinDTO>) {
    this.currentVerein = response.payload;
    this.loading = false;
  }

  private handleVereinFailure(response: BogenligaResponse<VereinDTO>) {
    this.loading = false;
  }

}
