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
import {DsbMitgliedDTO} from '@verwaltung/types/datatransfer/dsb-mitglied-dto.class';
import {VereinDO} from '@verwaltung/types/verein-do.class';
import {VereinDataProviderService} from '@verwaltung/services/verein-data-provider.service';
import {VersionedDataObject} from '@shared/data-provider/models/versioned-data-object.interface';
import {VereinDTO} from '@verwaltung/types/datatransfer/verein-dto.class';
import {LizenzDataProviderService} from '@verwaltung/services/lizenz-data-provider.service';
import {LizenzDO} from '@verwaltung/types/lizenz-do.class';
import {WettkampfDataProviderService} from '@vereine/services/wettkampf-data-provider.service';
import {WettkampfDO} from '@vereine/types/wettkampf-do.class';
import {RegionDataProviderService} from '@verwaltung/services/region-data-provider.service';
import {RegionDO} from '@verwaltung/types/region-do.class';
import {parseHttpResponse} from 'selenium-webdriver/http';


const ID_PATH_PARAM = 'id';
const NOTIFICATION_SAVE_SCHUETZE = 'schütze_hinzufügen_save';
const NOTIFICATION_DUPLICATE_SCHUETZE = 'schütze_hinzufügen_doppelt';
const NOTIFICATION_OVERUSED_SCHUETZE = 'schütze_hinzufügen_in_zu_vielen_mannschaften';
const NOTIFICATION_NO_WETTKAMPFE = 'keine_wettkaepfe_fehler';

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
  // team and club you want to add to
  public currentMannschaft: DsbMannschaftDO = new DsbMannschaftDO();
  public currentVerein: VereinDO = new VereinDO();

  public memberToAdd: MannschaftsMitgliedDO = new MannschaftsMitgliedDO();
  public members: DsbMitgliedDO[] = [new DsbMitgliedDO()];
  public vereine: VereinDO[] = [new VereinDO()];

  // attributes for the filter of the members
  public filterVorname = '';
  public filterNachname = '';
  public filterMitgliedsnummer = '';
  public filterVerein: VereinDO = new VereinDO();
  public emptyVerein: VereinDO = new VereinDO();


  public deleteLoading = false;
  public saveLoading = false;

  constructor(private mannschaftProvider: DsbMannschaftDataProviderService,
              private dsbMitgliedProvider: DsbMitgliedDataProviderService,
              private mannschaftMitgliedProvider: MannschaftsmitgliedDataProviderService,
              private vereineProvider: VereinDataProviderService,
              private lizenzProvider: LizenzDataProviderService,
              private regionProvider: RegionDataProviderService,
              private wettkampfProvider: WettkampfDataProviderService,
              private router: Router,
              private route: ActivatedRoute,
              private notificationService: NotificationService) {
    super();
  }

  ngOnInit() {
    this.loading = true;

    this.loadMannschaftById(Number.parseInt(this.route.snapshot.url[2].path, 10));
    this.loadVereinById(Number.parseInt(this.route.snapshot.url[1].path, 10));
    this.loadVereine();

    this.notificationService.discardNotification();
  }

  public onSave(member: VersionedDataObject): void {
    this.saveLoading = true;

    this.memberToAdd.dsbMitgliedId = member.id;
    this.memberToAdd.mannschaftsId = this.currentMannschaft.id;

    this.mannschaftMitgliedProvider.findAllByTeamId(this.currentMannschaft.id)
        .then((teamMembers: BogenligaResponse<MannschaftsMitgliedDO[]>) => {
          console.log(teamMembers.payload);
          if (this.duplicateMember(teamMembers.payload, this.memberToAdd)) {
            this.showDuplicateMember();
          } else {
            this.saveMemberInTeam(member.id);
          }
        })
        .catch((teamMembers: BogenligaResponse<MannschaftsMitgliedDO>) => {
          console.log('Failure');
        });
  }

  private duplicateMember(teamMembers: MannschaftsMitgliedDO[], member: MannschaftsMitgliedDO): boolean {
    console.log('checking for duplicate member...');
    let duplicateFound = false;
    teamMembers.forEach((teamMember) => {
      if (teamMember.dsbMitgliedId === member.dsbMitgliedId) {
        console.log('duplicate member: ' + teamMember);
        duplicateFound = true;
      }
    });
    return duplicateFound;
  }

  private sendSaveRequest(jsonPath: string, savedLizenzResponse: BogenligaResponse<LizenzDO>) {
    this.mannschaftMitgliedProvider.create(this.memberToAdd)
        .then((savedResponse: BogenligaResponse<MannschaftsMitgliedDO>) => {
          this.showAddedMemberNotification(jsonPath);
          console.log('saving ' + this.memberToAdd + ' in Mannschaft');
        }, (savedResponse: BogenligaResponse<MannschaftsMitgliedDO>) => {

          // delete lizenz if saving teammember fails and a new lizenz was created
          if (savedLizenzResponse != null) {
            this.lizenzProvider.deleteById(savedLizenzResponse.payload.lizenzId)
                .then(() => {
                  console.log('Successfully deleted Lizenz');
                }, () => {
                  console.log('Failed to delete Lizenz');
                });
          }
          console.log(savedResponse.payload);
          console.log('Failed to Save new Teammember');
          this.saveLoading = false;
        });
  }

  private saveMemberInTeam(memberId: number) {
    this.mannschaftMitgliedProvider.findByMemberId(memberId)
        .then((mannschaftsMitgliedResponse: BogenligaResponse<MannschaftsMitgliedDO[]>) => {
          if (mannschaftsMitgliedResponse.payload.length > 0 && mannschaftsMitgliedResponse.payload[0].dsbMitgliedEingesetzt <= 1) {
            this.memberToAdd.dsbMitgliedEingesetzt = mannschaftsMitgliedResponse.payload[0].dsbMitgliedEingesetzt;
            this.createLizentForMember(memberId);
          } else if(mannschaftsMitgliedResponse.payload.length === 0) {
            this.memberToAdd.dsbMitgliedEingesetzt = 0;
            this.createLizentForMember(memberId);
          } else {
            this.showMemberInTooManyTeams();
          }
        })
        .catch((response: BogenligaResponse<MannschaftsMitgliedDO[]>) => {
          console.log('Failure: ' + response.payload);
      this.saveLoading = false;
    });
  }

  private createLizentForMember(memberId: number): void {

    // get Lizenzen of this member
    this.lizenzProvider.findByDsbMitgliedId(memberId)
        .then((lizenzResponse: BogenligaResponse<LizenzDO[]>) => {

          let lizenzen: LizenzDO[] = [new LizenzDO()];
          lizenzen = lizenzResponse.payload;
          console.log(lizenzResponse.payload);

          // get Diszipin of the wettkaempfe of the Veranstaltung
          this.wettkampfProvider.findAll()
              .then((wettkampfResponse: BogenligaResponse<WettkampfDO[]>) => {

                const veranstaltungen: WettkampfDO[] = [];
                wettkampfResponse.payload.forEach( (wettkampf) => {
                  if (wettkampf.veranstaltungsId === this.currentMannschaft.veranstaltungId) {
                    veranstaltungen.push(wettkampf);
                  }
                });
                console.log(veranstaltungen);

                let wettkampfDisziplinID;
                let lizenzFound = false;

                console.log(wettkampfResponse.payload);

                if (veranstaltungen.length !== 0) { // check if there are wettkaempfe in the liga
                  wettkampfDisziplinID = veranstaltungen[0].wettkampfDisziplinId; // take the Disziplin of the first wettkampftag
                  console.log(wettkampfDisziplinID);
                  if (lizenzen.length > 0) {
                    console.log('lizenzen not empty');
                    lizenzen.forEach((lizenz) => {
                      console.log('for each lizenz');
                      console.log(lizenz.lizenztyp + lizenz.lizenzDisziplinId + wettkampfDisziplinID);
                      // check if Mitglied has already has a Lizenz in this Disziplin
                      if ( lizenz.lizenztyp === 'Liga' && lizenz.lizenzDisziplinId === wettkampfDisziplinID) {
                        console.log('Lizenz Found!');
                        lizenzFound = true;
                      }
                    });
                  }


                  // create new Lizenz if Mitglied has no Lizenz in this Disziplin
                  if (lizenzFound === false) {

                    // create lizenznummer
                    // first get Region Kuerzel
                    this.regionProvider.findById(this.currentVerein.regionId)
                        .then((regionResponse: BogenligaResponse<RegionDO>) => {

                          const regionKuerzel = regionResponse.payload.regionKuerzel;

                          // Lizenznummer = Regionkürzel+LigaId+vereinsId+mannschaftsnummer+dsbmitgliedsId
                          const lizenznummer = regionKuerzel +
                            this.currentMannschaft.veranstaltungId +
                            this.currentVerein.id +
                            this.currentMannschaft.nummer +
                            memberId;

                          const newLizenz = new LizenzDO();
                          newLizenz.lizenztyp = 'Liga';
                          newLizenz.lizenzDisziplinId = wettkampfDisziplinID;
                          newLizenz.lizenzDsbMitgliedId = memberId;
                          newLizenz.lizenzRegionId = this.currentVerein.regionId;
                          newLizenz.lizenznummer = lizenznummer;

                          this.lizenzProvider.create(newLizenz)
                              .then((response: BogenligaResponse<LizenzDO>) => {

                                console.log(response.payload);
                                this.sendSaveRequest('MANAGEMENT.SCHUETZE_HINZUFUEGEN.NOTIFICATION.SAVE_AND_LIZENZ_ERSTELLT', response);

                              }, (savedResponse: BogenligaResponse<LizenzDO[]>) => {
                                console.log(savedResponse.payload);
                                console.log('Failed to save Lizenz');
                                this.saveLoading = false;
                              });

                        }, (savedResponse: BogenligaResponse<RegionDO[]>) => {
                          console.log(savedResponse.payload);
                          console.log('Failed to load Region');
                          this.saveLoading = false;
                        });
                  } else {
                    this.sendSaveRequest('MANAGEMENT.SCHUETZE_HINZUFUEGEN.NOTIFICATION.SAVE', null);
                  }
                } else {

                  this.showAddedMemberNotification( 'MANAGEMENT.SCHUETZE_HINZUFUEGEN.NOTIFICATION.NOWETTKAEMPFE');
                  console.log('Keine Wettkaempfe gefunden. Bitte stelle sicher das die Liga der Mannschaft Wettkampfe beinhaltet.');
                }


              }, (savedResponse: BogenligaResponse<WettkampfDO[]>) => {
                console.log(savedResponse.payload);
                console.log('Failed');
                this.saveLoading = false;
              });

        }, (savedResponse: BogenligaResponse<LizenzDO>) => {

          console.log('Keine Lizenz fuer den Schuetzen gefunden');
          this.saveLoading = false;
        });
}

  private showAddedMemberNotification(jsonPath: string) {
    // savedResponse: BogenligaResponse<MannschaftsMitgliedDO>,
    // if (!isNullOrUndefined(savedResponse)
    //   && !isNullOrUndefined(savedResponse.payload)
    //   && !isNullOrUndefined(savedResponse.payload.id)) {
      console.log('Saved Teammember: ');

      const notification: Notification = {
        id:          NOTIFICATION_SAVE_SCHUETZE,
        title:       jsonPath + '.TITLE',
        description: jsonPath + '.DESCRIPTION',
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
    // }
  }

  // shows a notification for the user, if the member, he wants to add, is used in to many teams
  private showMemberInTooManyTeams() {
    const MemberInTooManyTeamsNotification: Notification = {
      id:          NOTIFICATION_OVERUSED_SCHUETZE,
      title:       'MANAGEMENT.SCHUETZE_HINZUFUEGEN.NOTIFICATION.OVERUSED.TITLE',
      description: 'MANAGEMENT.SCHUETZE_HINZUFUEGEN.NOTIFICATION.OVERUSED.DESCRIPTION',
      severity:    NotificationSeverity.INFO,
      origin:      NotificationOrigin.USER,
      type:        NotificationType.OK,
      userAction:  NotificationUserAction.PENDING
    };

    this.notificationService.observeNotification(NOTIFICATION_OVERUSED_SCHUETZE)
        .subscribe((myDuplicateNotification) => {
          if (myDuplicateNotification.userAction === NotificationUserAction.ACCEPTED) {
            this.saveLoading = false;
            this.router.navigateByUrl('/verwaltung/vereine/' + this.currentVerein.id
              + '/' + this.currentMannschaft.id + '/add');
          }
        });
    this.notificationService.showNotification(MemberInTooManyTeamsNotification);
  }

  // shows a notification for the user, if the member, he wants to add, already exists in the team
  private showDuplicateMember() {
    const duplicateMemberNotification: Notification = {
      id:          NOTIFICATION_DUPLICATE_SCHUETZE,
      title:       'MANAGEMENT.SCHUETZE_HINZUFUEGEN.NOTIFICATION.DUPLICATE.TITLE',
      description: 'MANAGEMENT.SCHUETZE_HINZUFUEGEN.NOTIFICATION.DUPLICATE.DESCRIPTION',
      severity:    NotificationSeverity.INFO,
      origin:      NotificationOrigin.USER,
      type:        NotificationType.OK,
      userAction:  NotificationUserAction.PENDING
    };

    this.notificationService.observeNotification(NOTIFICATION_DUPLICATE_SCHUETZE)
        .subscribe((myDuplicateNotification) => {
          if (myDuplicateNotification.userAction === NotificationUserAction.ACCEPTED) {
            this.saveLoading = false;
            this.router.navigateByUrl('/verwaltung/vereine/' + this.currentVerein.id
              + '/' + this.currentMannschaft.id + '/add');
          }
        });
    this.notificationService.showNotification(duplicateMemberNotification);
  }

  // --------------- Filter functions -------------------------- //
  public onSearch() {
     const filteredMembers = this.members.filter((member) => {
        return (member.vorname.toLowerCase().startsWith(this.filterVorname.toLowerCase()) || this.filterVorname.length === 0)
        && (member.nachname.toLowerCase().startsWith(this.filterNachname.toLowerCase()) || this.filterNachname.length === 0)
        && (member.mitgliedsnummer.toLowerCase().startsWith(this.filterMitgliedsnummer.toLowerCase()) || this.filterMitgliedsnummer.length === 0)
          && (member.vereinsId === this.filterVerein.id || this.filterVerein.id === undefined);
    });
     this.rows = toTableRows(filteredMembers);
  }

  public deleteFilter() {
    this.filterVorname = '';
    this.filterNachname = '';
    this.filterMitgliedsnummer = '';
    this.filterVerein = new VereinDO();
    this.onSearch();
  }
  // ----------------------------------------------------------- //

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
    this.members.forEach((member) => {
      if(member.vereinsId === null) {
        member.vereinsName = 'kein Verein';
      } else {
        const tmp = this.vereine.find((verein) => {
          return verein.id === member.vereinsId;
        });
        member.vereinsName = tmp.name;
      }
    });
    this.rows = toTableRows(this.members);
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

  private loadVereine() {
    this.loading = true;
    this.emptyVerein.name = "Kein Verein";
    this.emptyVerein.id = null;
    this.vereineProvider.findAll()
      .then((response: BogenligaResponse<VereinDTO[]>) => {
        this.vereine = [];
        this.vereine = response.payload;
        this.loadTableRows();
      })
      .catch((response: BogenligaResponse<VereinDTO[]>) => {
        this.vereine = [];
      });
    this.loading = false;
  }

}
