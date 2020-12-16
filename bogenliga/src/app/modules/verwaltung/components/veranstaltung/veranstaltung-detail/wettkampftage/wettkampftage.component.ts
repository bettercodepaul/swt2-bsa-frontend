import {Component, NgModule, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CommonComponentDirective} from '@shared/components';
import {ButtonType} from '@shared/components';
import {BogenligaResponse} from '@shared/data-provider';
import {isNullOrUndefined, isUndefined} from '@shared/functions';
import {
  Notification,
  NotificationOrigin,
  NotificationService,
  NotificationSeverity,
  NotificationType,
  NotificationUserAction
} from '../../../../../shared/services/notification';
import {UserProfileDataProviderService} from '@user/services/user-profile-data-provider.service';
import {UserProfileDTO} from '@user/types/model/user-profile-dto.class';
import {UserProfileDO} from '@user/types/user-profile-do.class';
import {VeranstaltungDataProviderService} from '../../../../services/veranstaltung-data-provider.service';
import {VeranstaltungDO} from '../../../../types/veranstaltung-do.class';
import {WETTKAMPFTAGE_CONFIG} from './wettkampftage.config';
import {WettkampfDO} from '@verwaltung/types/wettkampf-do.class';
import {WettkampfDTO} from '@verwaltung/types/datatransfer/wettkampf-dto.class';
import {WettkampfDataProviderService} from '../../../../services/wettkampf-data-provider.service';
import {BenutzerRolleDO} from '@verwaltung/types/benutzer-rolle-do.class';
import {BenutzerRolleDTO} from '@verwaltung/types/datatransfer/benutzer-rolle-dto.class';
import {BenutzerDataProviderService} from '../../../../services/benutzer-data-provider.service';
import {KampfrichterDO} from '@verwaltung/types/kampfrichter-do.class';
import {KampfrichterDTO} from '@verwaltung/types/datatransfer/kampfrichter-dto.class';
import {KampfrichterProviderService} from '../../../../services/kampfrichter-data-provider.service';
import {LigaDataProviderService} from '@verwaltung/services/liga-data-provider.service';
import {LizenzDO} from '@verwaltung/types/lizenz-do.class';
import {DsbMitgliedDO} from '@verwaltung/types/dsb-mitglied-do.class';
import {DsbMitgliedDataProviderService} from '@verwaltung/services/dsb-mitglied-data-provider.service';
import {LizenzDataProviderService} from '@verwaltung/services/lizenz-data-provider.service';
import {log} from 'util';


const ID_PATH_PARAM = 'id';
const NOTIFICATION_DELETE_VERANSTALTUNG = 'veranstaltung_detail_delete';
const NOTIFICATION_DELETE_VERANSTALTUNG_SUCCESS = 'veranstaltung_detail_delete_success';
const NOTIFICATION_DELETE_VERANSTALTUNG_FAILURE = 'veranstaltung_detail_delete_failure';
const NOTIFICATION_SAVE_VERANSTALTUNG = 'veranstaltung_detail_save';
const NOTIFICATION_UPDATE_VERANSTALTUNG = 'veranstaltung_detail_update';

// TODO: die Variable valid zur Steuerung disabled (SaveButton) ist global, ohne Funktion und unterscheidet nicht den
// Status der Eingabefelder

@Component({
  selector:    'bla-wettkampftage',
  templateUrl: './wettkampftage.component.html',
  styleUrls:   ['./wettkampftage.component.scss']
})

export class WettkampftageComponent extends CommonComponentDirective implements OnInit {
  public config = WETTKAMPFTAGE_CONFIG;
  public ButtonType = ButtonType;

  public currentVeranstaltung: VeranstaltungDO = new VeranstaltungDO();

  public currentUser: UserProfileDO;

  // TODO: Rename allUsers to allSportleiter and check, if we even need them
  public allKampfrichterLizenzen: Array<LizenzDO> = [];
  public allDsbMitgliederWithKampfrichterLizenz: Array<DsbMitgliedDO> = [];
  public allBenutzerWithKampfrichterLizenz: Array<BenutzerRolleDO> = [];
  public notSelectedKampfrichterWettkampftag1: Array<BenutzerRolleDO> = [];
  public notSelectedKampfrichterWettkampftag2: Array<BenutzerRolleDO> = [];
  public notSelectedKampfrichterWettkampftag3: Array<BenutzerRolleDO> = [];
  public notSelectedKampfrichterWettkampftag4: Array<BenutzerRolleDO> = [];
  // public allUsersTag1: Array<BenutzerRolleDO> = [];
  // public allUsersTag2: Array<BenutzerRolleDO> = [];
  // public allUsersTag3: Array<BenutzerRolleDO> = [];
  // public allUsersTag4: Array<BenutzerRolleDO> = [];

  public initiallySelectedKampfrichterTag1: Array<BenutzerRolleDO> = [];
  public initiallySelectedKampfrichterTag2: Array<BenutzerRolleDO> = [];
  public initiallySelectedKampfrichterTag3: Array<BenutzerRolleDO> = [];
  public initiallySelectedKampfrichterTag4: Array<BenutzerRolleDO> = [];
  public selectedKampfrichterTag1: Array<BenutzerRolleDO> = [];
  public selectedKampfrichterTag2: Array<BenutzerRolleDO> = [];
  public selectedKampfrichterTag3: Array<BenutzerRolleDO> = [];
  public selectedKampfrichterTag4: Array<BenutzerRolleDO> = [];

  // public allKampfrichter: Array<KampfrichterDO> = [];
  public kampfrichterTag1: Array<KampfrichterDO> = [];
  public kampfrichterTag2: Array<KampfrichterDO> = [];
  public kampfrichterTag3: Array<KampfrichterDO> = [];
  public kampfrichterTag4: Array<KampfrichterDO> = [];

  public currentWettkampftag_1: WettkampfDO = new WettkampfDO();
  public currentWettkampftag_2: WettkampfDO = new WettkampfDO();
  public currentWettkampftag_3: WettkampfDO = new WettkampfDO();
  public currentWettkampftag_4: WettkampfDO = new WettkampfDO();
  public allWettkampf: Array<WettkampfDO> = [];


  public currentAusrichter1: UserProfileDO = new UserProfileDO();
  public currentAusrichter2: UserProfileDO = new UserProfileDO();
  public currentAusrichter3: UserProfileDO = new UserProfileDO();
  public currentAusrichter4: UserProfileDO = new UserProfileDO();
  public allUsers: Array<UserProfileDO> = [new UserProfileDO()];

  public deleteLoading = false;
  public saveLoading = false;

  public id;

  constructor(
    private veranstaltungDataProvider: VeranstaltungDataProviderService,
    private wettkampfDataProvider: WettkampfDataProviderService,
    private userProvider: UserProfileDataProviderService,
    private lizenzProvider: LizenzDataProviderService,
    private dsbMitgliedProvider: DsbMitgliedDataProviderService,
    private benutzerRolleProvider: BenutzerDataProviderService,
    private kampfrichterProvider: KampfrichterProviderService,
    private router: Router,
    private route: ActivatedRoute,
    private notificationService: NotificationService) {
    super();
  }

  ngOnInit() {
    this.loading = true;
    this.notificationService.discardNotification();
    this.route.params.subscribe((params) => {
      if (!isUndefined(params[ID_PATH_PARAM])) {
        this.id = params[ID_PATH_PARAM];
        if (this.id === 'add') {
          this.currentVeranstaltung = new VeranstaltungDO();
          this.loading = false;
          this.deleteLoading = false;
          this.saveLoading = false;
        } else {
          this.loadById(params[ID_PATH_PARAM]);
          // this.loadUsers();   // This should only execute, when loadById has already finished!
        }
      }
    });
  }

  public onVeranstaltungDetail(ignore: any): void {
    this.navigateToWettkampftage(this.currentVeranstaltung);
  }

  // TODO: Rename in loadAusrichter or make it also load Kampfrichter
  private loadUsers() {
    this.userProvider.findAll()
        .then((response: BogenligaResponse<UserProfileDO[]>) => this.handleUserResponseArraySuccess(response))
        .catch((response: BogenligaResponse<UserProfileDTO[]>) => this.handleUserResponseArrayFailure(response));

  }

  private handleUserResponseArraySuccess(response: BogenligaResponse<UserProfileDO[]>): void {
    console.log('==> HandleUserResponseArraySuccess');
    this.allUsers = [];
    this.allUsers = response.payload;
    // this.currentWettkampftag_1.wettkampfAusrichter is null?
    this.currentAusrichter1 = this.allUsers.filter((user) => user.id === this.currentWettkampftag_1.wettkampfAusrichter)[0] ?? this.allUsers[0];
    this.currentAusrichter2 = this.allUsers.filter((user) => user.id === this.currentWettkampftag_2.wettkampfAusrichter)[0] ?? this.allUsers[0];
    this.currentAusrichter3 = this.allUsers.filter((user) => user.id === this.currentWettkampftag_3.wettkampfAusrichter)[0] ?? this.allUsers[0];
    this.currentAusrichter4 = this.allUsers.filter((user) => user.id === this.currentWettkampftag_4.wettkampfAusrichter)[0] ?? this.allUsers[0];

    this.loading = false;
  }

  private handleUserResponseArrayFailure(response: BogenligaResponse<UserProfileDTO[]>): void {
    this.allUsers = [];
    this.loading = false;
  }

  private navigateToWettkampftage(ignore: any) {
    this.router.navigateByUrl('/verwaltung/veranstaltung/' + this.currentVeranstaltung.id);
  }


  public onSaveWettkampfTag1(ignore: any): void {
    let wettkampftagAlreadyExists: boolean;

    this.currentWettkampftag_1.wettkampfVeranstaltungsId = this.currentVeranstaltung.id;
    this.currentWettkampftag_1.wettkampfTag = 1;
    this.currentWettkampftag_1.wettkampfDisziplinId = 0;
    this.currentWettkampftag_1.wettkampfTypId = this.currentVeranstaltung.wettkampfTypId;
    this.currentWettkampftag_1.wettkampfAusrichter = this.currentAusrichter1.id;

    // this.currentWettkampftag_1.kampfrichterID = this.selectedKampfrichterTag1[0].id;
    // console.log('==>onSaveWettkampfTag1: Selected kampfrichter-ID: ' + this.currentWettkampftag_1.kampfrichterID);


    if (this.currentWettkampftag_1.id == null) {
      wettkampftagAlreadyExists = false;
      // die Daten sind initial angelegt - es exitsiert noch keine ID --> Save nicht update
      this.currentWettkampftag_1.id = this.saveWettkampftag(this.currentWettkampftag_1);
    } else {
      wettkampftagAlreadyExists = true;
      this.updateWettkampftag(this.currentWettkampftag_1);
    }

    // Justins code
    // TODO: Figure out which Kampfrichter to delete ot not to update
    // TODO: Deal with the following error that sometimes occurs: "this.kampfrichterTag1[i] is undefined" (SOLVED)
    // The error probably appears when TeamSportleiter is selected, because of the "liga" error


    let kampfrichterBenutzerToSaveTag1: Array<BenutzerRolleDO> = [];
    let kampfrichterBenutzerToDeleteTag1: Array<BenutzerRolleDO> = [];

    // this.selectedKampfrichterTag1.filter(user => this.initiallySelectedKampfrichterTag1.indexOf(user) < 0).forEach(user => kampfrichterBenutzerToSaveTag1.push(Object.assign({}, user)));
    // this.initiallySelectedKampfrichterTag1.filter(user => this.selectedKampfrichterTag1.indexOf(user) < 0).forEach(user => kampfrichterBenutzerToDeleteTag1.push(Object.assign({}, user)));


    function comparer(otherArray) {

      return (current) => otherArray.filter((other) => {
        return JSON.stringify(other) === JSON.stringify(current); // && other.display == current.display
      }).length === 0;

    }

    kampfrichterBenutzerToSaveTag1 = this.selectedKampfrichterTag1.filter(comparer(this.initiallySelectedKampfrichterTag1));
    kampfrichterBenutzerToDeleteTag1 = this.initiallySelectedKampfrichterTag1.filter(comparer(this.selectedKampfrichterTag1));

    // kampfrichterBenutzerToSaveTag1 = this.selectedKampfrichterTag1.filter(user => !this.initiallySelectedKampfrichterTag1.includes(user));
    // kampfrichterBenutzerToDeleteTag1 = this.initiallySelectedKampfrichterTag1.filter(user => !this.selectedKampfrichterTag1.includes(user));

    // kampfrichterBenutzerToSaveTag1 = this.selectedKampfrichterTag1.filter(user => this.initiallySelectedKampfrichterTag1.indexOf(user) < 0);
    // kampfrichterBenutzerToDeleteTag1 = this.initiallySelectedKampfrichterTag1.filter(user => this.selectedKampfrichterTag1.indexOf(user) < 0);
    console.log('kampfrichterBenutzerToSaveTag1:');
    console.log(kampfrichterBenutzerToSaveTag1);
    console.log('kampfrichterBenutzerToDeleteTag1:');
    console.log(kampfrichterBenutzerToDeleteTag1);


    // this.initiallySelectedKampfrichterTag1.forEach(val => this.selectedKampfrichterTag1.push(Object.assign({},
    // val))); this.notSelectedKampfrichterWettkampftag1 = this.allBenutzerWithKampfrichterLizenz.filter(user =>
    // this.initiallySelectedKampfrichterTag1.indexOf(user) < 0);


    this.kampfrichterTag1 = [];
    const kampfrichterToSaveTag1: Array<KampfrichterDO> = [];

    for (const i of Object.keys(kampfrichterBenutzerToSaveTag1)) {
      kampfrichterToSaveTag1.push(new KampfrichterDO());
      // this.kampfrichterTag1.push(this.allKampfrichter.filter((kampfrichter) => kampfrichter.id ===
      // this.selectedKampfrichterTag1[i].id)[0]);
      console.log(i);
      kampfrichterToSaveTag1[i].id = kampfrichterBenutzerToSaveTag1[i].id;
      kampfrichterToSaveTag1[i].wettkampfID = this.currentWettkampftag_1.id;
      kampfrichterToSaveTag1[i].leitend = false;
    }


    const kampfrichterToDeleteTag1: Array<KampfrichterDO> = [];

    for (const i of Object.keys(kampfrichterBenutzerToDeleteTag1)) {
      kampfrichterToDeleteTag1.push(new KampfrichterDO());
      // this.kampfrichterTag1.push(this.allKampfrichter.filter((kampfrichter) => kampfrichter.id ===
      // this.selectedKampfrichterTag1[i].id)[0]);
      console.log(i);
      kampfrichterToDeleteTag1[i].id = kampfrichterBenutzerToDeleteTag1[i].id;
      kampfrichterToDeleteTag1[i].wettkampfID = this.currentWettkampftag_1.id;
      kampfrichterToDeleteTag1[i].leitend = false;
    }

    console.log('initiallySelectedKampfrichterTag1:');
    console.log(this.initiallySelectedKampfrichterTag1);
    console.log('selectedKampfrichterTag1:');
    console.log(this.selectedKampfrichterTag1);
    // console.log('allKampfrichter:');
    // console.log(this.allKampfrichter)
    console.log('kampfrichterTag1:');
    console.log(this.kampfrichterTag1);

    if (kampfrichterToSaveTag1.length > 0) {
      console.log(kampfrichterToSaveTag1.length);
      // if (!wettkampftagAlreadyExists) {
      this.saveKampfrichterArray(kampfrichterToSaveTag1);
      // } else {
      //   this.updateKampfrichterArray(this.kampfrichterTag1);
      // }
    }

    if (kampfrichterToDeleteTag1.length > 0) {
      console.log(kampfrichterToDeleteTag1.length);
      // if (!wettkampftagAlreadyExists) {
      this.deleteKampfrichterArray(kampfrichterToDeleteTag1);
      // } else {
      //   this.updateKampfrichterArray(this.kampfrichterTag1);
      // }
    }
  }


  public onSaveWettkampfTag2(ignore: any): void {

    let wettkampftagAlreadyExists: boolean;

    this.currentWettkampftag_2.wettkampfVeranstaltungsId = this.currentVeranstaltung.id;
    this.currentWettkampftag_2.wettkampfTag = 2;
    this.currentWettkampftag_2.wettkampfDisziplinId = 0;
    this.currentWettkampftag_2.wettkampfTypId = this.currentVeranstaltung.wettkampfTypId;
    this.currentWettkampftag_2.wettkampfAusrichter = this.currentAusrichter2.id;

    // this.currentWettkampftag_2.kampfrichterID = this.selectedKampfrichterTag2[0].id;
    // console.log('==>onSaveWettkampfTag2: Selected kampfrichter-ID: ' + this.currentWettkampftag_2.kampfrichterID);


    if (this.currentWettkampftag_2.id == null) {
      wettkampftagAlreadyExists = false;
      // die Daten sind initial angelegt - es exitsiert noch keine ID --> Save nicht update
      this.currentWettkampftag_2.id = this.saveWettkampftag(this.currentWettkampftag_2);
    } else {
      wettkampftagAlreadyExists = true;
      this.updateWettkampftag(this.currentWettkampftag_2);
    }

    // Justins code
    // TODO: Figure out which Kampfrichter to delete ot not to update
    // TODO: Deal with the following error that sometimes occurs: "this.kampfrichterTag2[i] is undefined" (SOLVED)
    // The error probably appears when TeamSportleiter is selected, because of the "liga" error


    let kampfrichterBenutzerToSaveTag2: Array<BenutzerRolleDO> = [];
    let kampfrichterBenutzerToDeleteTag2: Array<BenutzerRolleDO> = [];

    // this.selectedKampfrichterTag2.filter(user => this.initiallySelectedKampfrichterTag2.indexOf(user) < 0).forEach(user => kampfrichterBenutzerToSaveTag2.push(Object.assign({}, user)));
    // this.initiallySelectedKampfrichterTag2.filter(user => this.selectedKampfrichterTag2.indexOf(user) < 0).forEach(user => kampfrichterBenutzerToDeleteTag2.push(Object.assign({}, user)));


    function comparer(otherArray) {
      return (current) => otherArray.filter((other) => {
        return JSON.stringify(other) === JSON.stringify(current); // && other.display == current.display
      }).length === 0;
    }

    kampfrichterBenutzerToSaveTag2 = this.selectedKampfrichterTag2.filter(comparer(this.initiallySelectedKampfrichterTag2));
    kampfrichterBenutzerToDeleteTag2 = this.initiallySelectedKampfrichterTag2.filter(comparer(this.selectedKampfrichterTag2));

    // kampfrichterBenutzerToSaveTag2 = this.selectedKampfrichterTag2.filter(user => !this.initiallySelectedKampfrichterTag2.includes(user));
    // kampfrichterBenutzerToDeleteTag2 = this.initiallySelectedKampfrichterTag2.filter(user => !this.selectedKampfrichterTag2.includes(user));

    // kampfrichterBenutzerToSaveTag2 = this.selectedKampfrichterTag2.filter(user => this.initiallySelectedKampfrichterTag2.indexOf(user) < 0);
    // kampfrichterBenutzerToDeleteTag2 = this.initiallySelectedKampfrichterTag2.filter(user => this.selectedKampfrichterTag2.indexOf(user) < 0);
    console.log('kampfrichterBenutzerToSaveTag2:');
    console.log(kampfrichterBenutzerToSaveTag2);
    console.log('kampfrichterBenutzerToDeleteTag2:');
    console.log(kampfrichterBenutzerToDeleteTag2);


    // this.initiallySelectedKampfrichterTag2.forEach(val => this.selectedKampfrichterTag2.push(Object.assign({},
    // val))); this.notSelectedKampfrichterWettkampftag2 = this.allBenutzerWithKampfrichterLizenz.filter(user =>
    // this.initiallySelectedKampfrichterTag2.indexOf(user) < 0);


    this.kampfrichterTag2 = [];
    const kampfrichterToSaveTag2: Array<KampfrichterDO> = [];

    for (const i of Object.keys(kampfrichterBenutzerToSaveTag2)) {
      kampfrichterToSaveTag2.push(new KampfrichterDO());
      // this.kampfrichterTag2.push(this.allKampfrichter.filter((kampfrichter) => kampfrichter.id ===
      // this.selectedKampfrichterTag2[i].id)[0]);
      console.log(i);
      kampfrichterToSaveTag2[i].id = kampfrichterBenutzerToSaveTag2[i].id;
      kampfrichterToSaveTag2[i].wettkampfID = this.currentWettkampftag_2.id;
      kampfrichterToSaveTag2[i].leitend = false;
    }

    const kampfrichterToDeleteTag2: Array<KampfrichterDO> = [];

    for (const i of Object.keys(kampfrichterBenutzerToDeleteTag2)) {
      kampfrichterToDeleteTag2.push(new KampfrichterDO());
      // this.kampfrichterTag2.push(this.allKampfrichter.filter((kampfrichter) => kampfrichter.id ===
      // this.selectedKampfrichterTag2[i].id)[0]);
      console.log(i);
      kampfrichterToDeleteTag2[i].id = kampfrichterBenutzerToDeleteTag2[i].id;
      kampfrichterToDeleteTag2[i].wettkampfID = this.currentWettkampftag_2.id;
      kampfrichterToDeleteTag2[i].leitend = false;
    }

    console.log('initiallySelectedKampfrichterTag2:');
    console.log(this.initiallySelectedKampfrichterTag2);
    console.log('selectedKampfrichterTag2:');
    console.log(this.selectedKampfrichterTag2);
    // console.log('allKampfrichter:');
    // console.log(this.allKampfrichter)
    console.log('kampfrichterTag2:');
    console.log(this.kampfrichterTag2);

    if (kampfrichterToSaveTag2.length > 0) {
      console.log(kampfrichterToSaveTag2.length);
      // if (!wettkampftagAlreadyExists) {
      this.saveKampfrichterArray(kampfrichterToSaveTag2);
      // } else {
      //   this.updateKampfrichterArray(this.kampfrichterTag2);
      // }
    }

    if (kampfrichterToDeleteTag2.length > 0) {
      console.log(kampfrichterToDeleteTag2.length);
      // if (!wettkampftagAlreadyExists) {
      this.deleteKampfrichterArray(kampfrichterToDeleteTag2);
      // } else {
      //   this.updateKampfrichterArray(this.kampfrichterTag2);
      // }
    }

  }

  public onSaveWettkampfTag3(ignore: any): void {

    let wettkampftagAlreadyExists: boolean;

    this.currentWettkampftag_3.wettkampfVeranstaltungsId = this.currentVeranstaltung.id;
    this.currentWettkampftag_3.wettkampfTag = 3;
    this.currentWettkampftag_3.wettkampfDisziplinId = 0;
    this.currentWettkampftag_3.wettkampfTypId = this.currentVeranstaltung.wettkampfTypId;
    this.currentWettkampftag_3.wettkampfAusrichter = this.currentAusrichter3.id;

    // this.currentWettkampftag_3.kampfrichterID = this.selectedKampfrichterTag3[0].id;
    // console.log('==>onSaveWettkampfTag3: Selected kampfrichter-ID: ' + this.currentWettkampftag_3.kampfrichterID);


    if (this.currentWettkampftag_3.id == null) {
      wettkampftagAlreadyExists = false;
      // die Daten sind initial angelegt - es exitsiert noch keine ID --> Save nicht update
      this.currentWettkampftag_3.id = this.saveWettkampftag(this.currentWettkampftag_3);
    } else {
      wettkampftagAlreadyExists = true;
      this.updateWettkampftag(this.currentWettkampftag_3);
    }

    // Justins code
    // TODO: Figure out which Kampfrichter to delete ot not to update
    // TODO: Deal with the following error that sometimes occurs: "this.kampfrichterTag3[i] is undefined" (SOLVED)
    // The error probably appears when TeamSportleiter is selected, because of the "liga" error


    let kampfrichterBenutzerToSaveTag3: Array<BenutzerRolleDO> = [];
    let kampfrichterBenutzerToDeleteTag3: Array<BenutzerRolleDO> = [];

    // this.selectedKampfrichterTag3.filter(user => this.initiallySelectedKampfrichterTag3.indexOf(user) < 0).forEach(user => kampfrichterBenutzerToSaveTag3.push(Object.assign({}, user)));
    // this.initiallySelectedKampfrichterTag3.filter(user => this.selectedKampfrichterTag3.indexOf(user) < 0).forEach(user => kampfrichterBenutzerToDeleteTag3.push(Object.assign({}, user)));


    function comparer(otherArray) {
      return (current) => otherArray.filter((other) => {
        return JSON.stringify(other) === JSON.stringify(current); // && other.display == current.display
      }).length === 0;
    }

    kampfrichterBenutzerToSaveTag3 = this.selectedKampfrichterTag3.filter(comparer(this.initiallySelectedKampfrichterTag3));
    kampfrichterBenutzerToDeleteTag3 = this.initiallySelectedKampfrichterTag3.filter(comparer(this.selectedKampfrichterTag3));

    // kampfrichterBenutzerToSaveTag3 = this.selectedKampfrichterTag3.filter(user => !this.initiallySelectedKampfrichterTag3.includes(user));
    // kampfrichterBenutzerToDeleteTag3 = this.initiallySelectedKampfrichterTag3.filter(user => !this.selectedKampfrichterTag3.includes(user));

    // kampfrichterBenutzerToSaveTag3 = this.selectedKampfrichterTag3.filter(user => this.initiallySelectedKampfrichterTag3.indexOf(user) < 0);
    // kampfrichterBenutzerToDeleteTag3 = this.initiallySelectedKampfrichterTag3.filter(user => this.selectedKampfrichterTag3.indexOf(user) < 0);
    console.log('kampfrichterBenutzerToSaveTag3:');
    console.log(kampfrichterBenutzerToSaveTag3);
    console.log('kampfrichterBenutzerToDeleteTag3:');
    console.log(kampfrichterBenutzerToDeleteTag3);


    // this.initiallySelectedKampfrichterTag3.forEach(val => this.selectedKampfrichterTag3.push(Object.assign({},
    // val))); this.notSelectedKampfrichterWettkampftag3 = this.allBenutzerWithKampfrichterLizenz.filter(user =>
    // this.initiallySelectedKampfrichterTag3.indexOf(user) < 0);


    this.kampfrichterTag3 = [];
    const kampfrichterToSaveTag3: Array<KampfrichterDO> = [];

    for (const i of Object.keys(kampfrichterBenutzerToSaveTag3)) {
      kampfrichterToSaveTag3.push(new KampfrichterDO());
      // this.kampfrichterTag3.push(this.allKampfrichter.filter((kampfrichter) => kampfrichter.id ===
      // this.selectedKampfrichterTag3[i].id)[0]);
      console.log(i);
      kampfrichterToSaveTag3[i].id = kampfrichterBenutzerToSaveTag3[i].id;
      kampfrichterToSaveTag3[i].wettkampfID = this.currentWettkampftag_3.id;
      kampfrichterToSaveTag3[i].leitend = false;
    }

    const kampfrichterToDeleteTag3: Array<KampfrichterDO> = [];

    for (const i of Object.keys(kampfrichterBenutzerToDeleteTag3)) {
      kampfrichterToDeleteTag3.push(new KampfrichterDO());
      // this.kampfrichterTag3.push(this.allKampfrichter.filter((kampfrichter) => kampfrichter.id ===
      // this.selectedKampfrichterTag3[i].id)[0]);
      console.log(i);
      kampfrichterToDeleteTag3[i].id = kampfrichterBenutzerToDeleteTag3[i].id;
      kampfrichterToDeleteTag3[i].wettkampfID = this.currentWettkampftag_3.id;
      kampfrichterToDeleteTag3[i].leitend = false;
    }

    console.log('initiallySelectedKampfrichterTag3:');
    console.log(this.initiallySelectedKampfrichterTag3);
    console.log('selectedKampfrichterTag3:');
    console.log(this.selectedKampfrichterTag3);
    // console.log('allKampfrichter:');
    // console.log(this.allKampfrichter)
    console.log('kampfrichterTag3:');
    console.log(this.kampfrichterTag3);

    if (kampfrichterToSaveTag3.length > 0) {
      console.log(kampfrichterToSaveTag3.length);
      // if (!wettkampftagAlreadyExists) {
      this.saveKampfrichterArray(kampfrichterToSaveTag3);
      // } else {
      //   this.updateKampfrichterArray(this.kampfrichterTag3);
      // }
    }

    if (kampfrichterToDeleteTag3.length > 0) {
      console.log(kampfrichterToDeleteTag3.length);
      // if (!wettkampftagAlreadyExists) {
      this.deleteKampfrichterArray(kampfrichterToDeleteTag3);
      // } else {
      //   this.updateKampfrichterArray(this.kampfrichterTag3);
      // }
    }
  }

  public onSaveWettkampfTag4(ignore: any): void {

    let wettkampftagAlreadyExists: boolean;

    this.currentWettkampftag_4.wettkampfVeranstaltungsId = this.currentVeranstaltung.id;
    this.currentWettkampftag_4.wettkampfTag = 4;
    this.currentWettkampftag_4.wettkampfDisziplinId = 0;
    this.currentWettkampftag_4.wettkampfTypId = this.currentVeranstaltung.wettkampfTypId;
    this.currentWettkampftag_4.wettkampfAusrichter = this.currentAusrichter4.id;

    // this.currentWettkampftag_4.kampfrichterID = this.selectedKampfrichterTag4[0].id;
    // console.log('==>onSaveWettkampfTag4: Selected kampfrichter-ID: ' + this.currentWettkampftag_4.kampfrichterID);


    if (this.currentWettkampftag_4.id == null) {
      wettkampftagAlreadyExists = false;
      // die Daten sind initial angelegt - es exitsiert noch keine ID --> Save nicht update
      this.currentWettkampftag_4.id = this.saveWettkampftag(this.currentWettkampftag_4);
    } else {
      wettkampftagAlreadyExists = true;
      this.updateWettkampftag(this.currentWettkampftag_4);
    }

    // Justins code
    // TODO: Figure out which Kampfrichter to delete ot not to update
    // TODO: Deal with the following error that sometimes occurs: "this.kampfrichterTag4[i] is undefined" (SOLVED)
    // The error probably appears when TeamSportleiter is selected, because of the "liga" error


    let kampfrichterBenutzerToSaveTag4: Array<BenutzerRolleDO> = [];
    let kampfrichterBenutzerToDeleteTag4: Array<BenutzerRolleDO> = [];

    // this.selectedKampfrichterTag4.filter(user => this.initiallySelectedKampfrichterTag4.indexOf(user) < 0).forEach(user => kampfrichterBenutzerToSaveTag4.push(Object.assign({}, user)));
    // this.initiallySelectedKampfrichterTag4.filter(user => this.selectedKampfrichterTag4.indexOf(user) < 0).forEach(user => kampfrichterBenutzerToDeleteTag4.push(Object.assign({}, user)));


    function comparer(otherArray) {
      return (current) => otherArray.filter((other) => {
        return JSON.stringify(other) === JSON.stringify(current); // && other.display == current.display
      }).length === 0;
    }

    kampfrichterBenutzerToSaveTag4 = this.selectedKampfrichterTag4.filter(comparer(this.initiallySelectedKampfrichterTag4));
    kampfrichterBenutzerToDeleteTag4 = this.initiallySelectedKampfrichterTag4.filter(comparer(this.selectedKampfrichterTag4));

    // kampfrichterBenutzerToSaveTag4 = this.selectedKampfrichterTag4.filter(user => !this.initiallySelectedKampfrichterTag4.includes(user));
    // kampfrichterBenutzerToDeleteTag4 = this.initiallySelectedKampfrichterTag4.filter(user => !this.selectedKampfrichterTag4.includes(user));

    // kampfrichterBenutzerToSaveTag4 = this.selectedKampfrichterTag4.filter(user => this.initiallySelectedKampfrichterTag4.indexOf(user) < 0);
    // kampfrichterBenutzerToDeleteTag4 = this.initiallySelectedKampfrichterTag4.filter(user => this.selectedKampfrichterTag4.indexOf(user) < 0);
    console.log('kampfrichterBenutzerToSaveTag4:');
    console.log(kampfrichterBenutzerToSaveTag4);
    console.log('kampfrichterBenutzerToDeleteTag4:');
    console.log(kampfrichterBenutzerToDeleteTag4);


    // this.initiallySelectedKampfrichterTag4.forEach(val => this.selectedKampfrichterTag4.push(Object.assign({},
    // val))); this.notSelectedKampfrichterWettkampftag4 = this.allBenutzerWithKampfrichterLizenz.filter(user =>
    // this.initiallySelectedKampfrichterTag4.indexOf(user) < 0);


    this.kampfrichterTag4 = [];
    const kampfrichterToSaveTag4: Array<KampfrichterDO> = [];

    for (const i of Object.keys(kampfrichterBenutzerToSaveTag4)) {
      kampfrichterToSaveTag4.push(new KampfrichterDO());
      // this.kampfrichterTag4.push(this.allKampfrichter.filter((kampfrichter) => kampfrichter.id ===
      // this.selectedKampfrichterTag4[i].id)[0]);
      console.log(i);
      kampfrichterToSaveTag4[i].id = kampfrichterBenutzerToSaveTag4[i].id;
      kampfrichterToSaveTag4[i].wettkampfID = this.currentWettkampftag_4.id;
      kampfrichterToSaveTag4[i].leitend = false;
    }

    const kampfrichterToDeleteTag4: Array<KampfrichterDO> = [];

    for (const i of Object.keys(kampfrichterBenutzerToDeleteTag4)) {
      kampfrichterToDeleteTag4.push(new KampfrichterDO());
      // this.kampfrichterTag4.push(this.allKampfrichter.filter((kampfrichter) => kampfrichter.id ===
      // this.selectedKampfrichterTag4[i].id)[0]);
      console.log(i);
      kampfrichterToDeleteTag4[i].id = kampfrichterBenutzerToDeleteTag4[i].id;
      kampfrichterToDeleteTag4[i].wettkampfID = this.currentWettkampftag_4.id;
      kampfrichterToDeleteTag4[i].leitend = false;
    }

    console.log('initiallySelectedKampfrichterTag4:');
    console.log(this.initiallySelectedKampfrichterTag4);
    console.log('selectedKampfrichterTag4:');
    console.log(this.selectedKampfrichterTag4);
    // console.log('allKampfrichter:');
    // console.log(this.allKampfrichter)
    console.log('kampfrichterTag4:');
    console.log(this.kampfrichterTag4);

    if (kampfrichterToSaveTag4.length > 0) {
      console.log(kampfrichterToSaveTag4.length);
      // if (!wettkampftagAlreadyExists) {
      this.saveKampfrichterArray(kampfrichterToSaveTag4);
      // } else {
      //   this.updateKampfrichterArray(this.kampfrichterTag4);
      // }
    }

    if (kampfrichterToDeleteTag4.length > 0) {
      console.log(kampfrichterToDeleteTag4.length);
      // if (!wettkampftagAlreadyExists) {
      this.deleteKampfrichterArray(kampfrichterToDeleteTag4);
      // } else {
      //   this.updateKampfrichterArray(this.kampfrichterTag4);
      // }
    }
  }

  private saveWettkampftag(wettkampfDO: WettkampfDO): number {

    this.wettkampfDataProvider.create(wettkampfDO)
        .then((response: BogenligaResponse<WettkampfDO>) => {
          if (!isNullOrUndefined(response)
            && !isNullOrUndefined(response.payload)
            && !isNullOrUndefined(response.payload.id)) {
            console.log('Saved with id: ' + response.payload.id);

            wettkampfDO.id = response.payload.id;
            console.log(wettkampfDO);

            // const notification: Notification = {
            //   id:          NOTIFICATION_SAVE_VERANSTALTUNG,
            //   title:       'MANAGEMENT.VERANSTALTUNG_DETAIL.FORM.WETTKAMPFTAG1.NOTIFICATION.SAVE.TITLE',
            //   description: 'MANAGEMENT.VERANSTALTUNG_DETAIL.FORM.WETTKAMPFTAG1.NOTIFICATION.SAVE.DESCRIPTION',
            //   severity:    NotificationSeverity.INFO,
            //   origin:      NotificationOrigin.USER,
            //   type:        NotificationType.OK,
            //   userAction:  NotificationUserAction.PENDING
            // };
            //
            // this.notificationService.observeNotification(NOTIFICATION_SAVE_VERANSTALTUNG)
            //     .subscribe((myNotification) => {
            //       if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
            //         this.saveLoading = false;
            //         this.router.navigateByUrl('/verwaltung/veranstaltung/' + this.currentVeranstaltung.id + '/' +
            // this.currentVeranstaltung.id); } });  this.notificationService.showNotification(notification);

          }
        }, (response: BogenligaResponse<WettkampfDO>) => {
          console.log('Failed');
          this.saveLoading = false;
        });

    return wettkampfDO.id;
  } // end save wettkampftag


  private updateWettkampftag(wettkampfDO: WettkampfDO): void {
    console.log('==> updateWettkampf');
    console.log(wettkampfDO);
    this.wettkampfDataProvider.update(wettkampfDO)
        .then((response: BogenligaResponse<WettkampfDO>) => {
          if (!isNullOrUndefined(response)
            && !isNullOrUndefined(response.payload)
            && !isNullOrUndefined(response.payload.id)) {
            console.log('Saved with id: ' + response.payload.id);

            // const notification: Notification = {
            //   id:          NOTIFICATION_SAVE_VERANSTALTUNG,
            //   title:       'MANAGEMENT.VERANSTALTUNG_DETAIL.FORM.WETTKAMPFTAG1.NOTIFICATION.UPDATE.TITLE',
            //   description: 'MANAGEMENT.VERANSTALTUNG_DETAIL.FORM.WETTKAMPFTAG1.NOTIFICATION.UPDATE.DESCRIPTION',
            //   severity:    NotificationSeverity.INFO,
            //   origin:      NotificationOrigin.USER,
            //   type:        NotificationType.OK,
            //   userAction:  NotificationUserAction.PENDING
            // };
            //
            // this.notificationService.observeNotification(NOTIFICATION_SAVE_VERANSTALTUNG)
            //     .subscribe((myNotification) => {
            //       if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
            //         this.saveLoading = false;
            //         this.router.navigateByUrl('/verwaltung/veranstaltung/' + this.currentVeranstaltung.id + '/' +
            // this.currentVeranstaltung.id); } });  this.notificationService.showNotification(notification);
          }
        }, (response: BogenligaResponse<WettkampfDO>) => {
          console.log('Failed');
          this.saveLoading = false;
        });
  }

  // Justins Code
  private saveKampfrichterArray(kampfrichterArray: Array<KampfrichterDO>): void {
    for (const iter of Object.keys(kampfrichterArray)) {
      // TODO: Fix the provider so that it doesn't send the data to the liga API
      this.kampfrichterProvider.create(kampfrichterArray[iter])
          .then((response: BogenligaResponse<KampfrichterDO>) => {
            if (!isNullOrUndefined(response)
              && !isNullOrUndefined(response.payload)
              && !isNullOrUndefined(response.payload.id)) {
              console.log('Saved with id: ' + response.payload.id);

              // TODO: Put this code in it's own method
              const notification: Notification = {
                id:          NOTIFICATION_SAVE_VERANSTALTUNG,
                title:       'MANAGEMENT.VERANSTALTUNG_DETAIL.FORM.WETTKAMPFTAG1.NOTIFICATION.SAVE.TITLE',
                description: 'MANAGEMENT.VERANSTALTUNG_DETAIL.FORM.WETTKAMPFTAG1.NOTIFICATION.SAVE.DESCRIPTION',
                severity:    NotificationSeverity.INFO,
                origin:      NotificationOrigin.USER,
                type:        NotificationType.OK,
                userAction:  NotificationUserAction.PENDING
              };

              this.notificationService.observeNotification(NOTIFICATION_SAVE_VERANSTALTUNG)
                  .subscribe((myNotification) => {
                    if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
                      this.saveLoading = false;
                      this.router.navigateByUrl('/verwaltung/veranstaltung/' + this.currentVeranstaltung.id + '/' + this.currentVeranstaltung.id);
                    }
                  });

              this.notificationService.showNotification(notification);
            }
          }, (response: BogenligaResponse<KampfrichterDO>) => {
            console.log('Failed');
            this.saveLoading = false;
          });
    }
  }

  // TODO: Fix the delete process so that it also reads the wettkampfId of the kampfrichter
  private deleteKampfrichterArray(kampfrichterArray: Array<KampfrichterDO>): void {
    for (const iter of Object.keys(kampfrichterArray)) {

      // TODO: Fix the provider so that it doesn't send the data to the liga API
      // this.kampfrichterProvider.delete(kampfrichterArray[iter]);
      this.kampfrichterProvider.deleteById(kampfrichterArray[iter].id);

      // .create(kampfrichterArray[iter])
          // .then((response: BogenligaResponse<KampfrichterDO>) => {
          //   if (!isNullOrUndefined(response)
          //     && !isNullOrUndefined(response.payload)
          //     && !isNullOrUndefined(response.payload.id)) {
          //     console.log('Saved with id: ' + response.payload.id);
          //
          //     // TODO: Put this code in it's own method
          //     const notification: Notification = {
          //       id:          NOTIFICATION_SAVE_VERANSTALTUNG,
          //       title:       'MANAGEMENT.VERANSTALTUNG_DETAIL.FORM.WETTKAMPFTAG1.NOTIFICATION.SAVE.TITLE',
          //       description: 'MANAGEMENT.VERANSTALTUNG_DETAIL.FORM.WETTKAMPFTAG1.NOTIFICATION.SAVE.DESCRIPTION',
          //       severity:    NotificationSeverity.INFO,
          //       origin:      NotificationOrigin.USER,
          //       type:        NotificationType.OK,
          //       userAction:  NotificationUserAction.PENDING
          //     };
          //
          //     this.notificationService.observeNotification(NOTIFICATION_SAVE_VERANSTALTUNG)
          //         .subscribe((myNotification) => {
          //           if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
          //             this.saveLoading = false;
          //             this.router.navigateByUrl('/verwaltung/veranstaltung/' + this.currentVeranstaltung.id + '/' + this.currentVeranstaltung.id);
          //           }
          //         });
          //
          //     this.notificationService.showNotification(notification);
          //   }
          // }, (response: BogenligaResponse<KampfrichterDO>) => {
          //   console.log('Failed');
          //   this.saveLoading = false;
          // });
    }
  }

  // TODO: Check if we even need this
  private updateKampfrichterArray(kampfrichterArray: Array<KampfrichterDO>): void {
    for (const iter of Object.keys(kampfrichterArray)) {
      this.kampfrichterProvider.update(kampfrichterArray[iter])
          .then((response: BogenligaResponse<KampfrichterDO>) => {
            if (!isNullOrUndefined(response)
              && !isNullOrUndefined(response.payload)
              && !isNullOrUndefined(response.payload.id)) {
              console.log('Saved with id: ' + response.payload.id);

              const notification: Notification = {
                id:          NOTIFICATION_SAVE_VERANSTALTUNG,
                title:       'MANAGEMENT.VERANSTALTUNG_DETAIL.FORM.WETTKAMPFTAG1.NOTIFICATION.UPDATE.TITLE',
                description: 'MANAGEMENT.VERANSTALTUNG_DETAIL.FORM.WETTKAMPFTAG1.NOTIFICATION.UPDATE.DESCRIPTION',
                severity:    NotificationSeverity.INFO,
                origin:      NotificationOrigin.USER,
                type:        NotificationType.OK,
                userAction:  NotificationUserAction.PENDING
              };

              this.notificationService.observeNotification(NOTIFICATION_SAVE_VERANSTALTUNG)
                  .subscribe((myNotification) => {
                    if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
                      this.saveLoading = false;
                      this.router.navigateByUrl('/verwaltung/veranstaltung/' + this.currentVeranstaltung.id + '/' + this.currentVeranstaltung.id);
                    }
                  });

              this.notificationService.showNotification(notification);
            }
          }, (response: BogenligaResponse<KampfrichterDO>) => {
            console.log('Failed');
            this.saveLoading = false;
          });
    }
  }


  public onDelete(ignore: any): void {
    this.deleteLoading = true;
    this.notificationService.discardNotification();

    const id = this.currentVeranstaltung.id;

    const notification: Notification = {
      id:               NOTIFICATION_DELETE_VERANSTALTUNG + id,
      title:            'MANAGEMENT.VERANSTALTUNG_DETAIL.NOTIFICATION.DELETE.TITLE',
      description:      'MANAGEMENT.VERANSTALTUNG_DETAIL.NOTIFICATION.DELETE.DESCRIPTION',
      descriptionParam: '' + id,
      severity:         NotificationSeverity.QUESTION,
      origin:           NotificationOrigin.USER,
      type:             NotificationType.YES_NO,
      userAction:       NotificationUserAction.PENDING
    };

    this.notificationService.observeNotification(NOTIFICATION_DELETE_VERANSTALTUNG + id)
        .subscribe((myNotification) => {

          if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
            this.veranstaltungDataProvider.deleteById(id)
                .then((response) => this.handleDeleteSuccess(response))
                .catch((response) => this.handleDeleteFailure(response));
          }
        });

    this.notificationService.showNotification(notification);
  }

  public entityExists(): boolean {
    return this.currentVeranstaltung.id >= 0;
  }

  private loadById(id: number) {
    this.veranstaltungDataProvider.findById(id)
        .then((response: BogenligaResponse<VeranstaltungDO>) => this.handleSuccess(response))
        .catch((response: BogenligaResponse<VeranstaltungDO>) => this.handleFailure(response));
  }

  private loadLizenzen() {
    this.lizenzProvider.findAll()
        .then((response: BogenligaResponse<LizenzDO[]>) => this.handleLizenzResponseArraySuccess(response))
        .catch((response: BogenligaResponse<LizenzDO[]>) => this.handleLizenzResponseArrayFailure(response)).then(() => this.loadDsbMitglieder());
  }

  private loadDsbMitglieder() {
    this.dsbMitgliedProvider.findAll()
        .then((response: BogenligaResponse<DsbMitgliedDO[]>) => this.handleDsbMitgliedResponseArraySuccess(response))
        .catch((response: BogenligaResponse<DsbMitgliedDO[]>) => this.handleDsbMitgliedResponseArrayFailure(response)).then(() => this.loadBenutzer());
  }

  private loadBenutzer() {
    this.benutzerRolleProvider.findAll()
        .then((response: BogenligaResponse<BenutzerRolleDO[]>) => this.handleBenutzerRolleResponseArraySuccess(response))
        .catch((response: BogenligaResponse<BenutzerRolleDTO[]>) => this.handleBenutzerRolleResponseArrayFailure(response)).then(() => this.loadKampfrichter());
  }

  private loadKampfrichter() {
    this.kampfrichterProvider.findAll()
        .then((response: BogenligaResponse<KampfrichterDO[]>) => this.handleKampfrichterResponseArraySuccess(
          response
        ))
        .catch((response: BogenligaResponse<KampfrichterDTO[]>) => this.handleKampfrichterResponseArrayFailure(response));

  }


  private loadWettkampf() {
    this.wettkampfDataProvider.findAll()
        .then((response: BogenligaResponse<WettkampfDO[]>) => this.handleWettkampfResponseArraySuccess(response))
        .catch((response: BogenligaResponse<WettkampfDTO[]>) => this.handleWettkampfResponseArrayFailure(response)).then(() => this.loadUsers());

  }

  private handleSuccess(response: BogenligaResponse<VeranstaltungDO>) {
    this.currentVeranstaltung = response.payload;
    this.loading = false;
    this.loadWettkampf();
    this.loadLizenzen();
  }

  private handleFailure(response: BogenligaResponse<VeranstaltungDO>) {
    this.loading = false;

  }

  private handleDeleteSuccess(response: BogenligaResponse<void>): void {

    const notification: Notification = {
      id:          NOTIFICATION_DELETE_VERANSTALTUNG_SUCCESS,
      title:       'MANAGEMENT.VERANSTALTUNG_DETAIL.NOTIFICATION.DELETE_SUCCESS.TITLE',
      description: 'MANAGEMENT.VERANSTALTUNG_DETAIL.NOTIFICATION.DELETE_SUCCESS.DESCRIPTION',
      severity:    NotificationSeverity.INFO,
      origin:      NotificationOrigin.USER,
      type:        NotificationType.OK,
      userAction:  NotificationUserAction.PENDING
    };

    this.notificationService.observeNotification(NOTIFICATION_DELETE_VERANSTALTUNG_SUCCESS)
        .subscribe((myNotification) => {
          if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
            this.router.navigateByUrl('/verwaltung/veranstaltung');
            this.deleteLoading = false;
          }
        });

    this.notificationService.showNotification(notification);
  }

  private handleDeleteFailure(response: BogenligaResponse<void>): void {

    const notification: Notification = {
      id:          NOTIFICATION_DELETE_VERANSTALTUNG_FAILURE,
      title:       'MANAGEMENT.VERANSTALTUNG_DETAIL.NOTIFICATION.DELETE_FAILURE.TITLE',
      description: 'MANAGEMENT.VERANSTALTUNG_DETAIL.NOTIFICATION.DELETE_FAILURE.DESCRIPTION',
      severity:    NotificationSeverity.ERROR,
      origin:      NotificationOrigin.USER,
      type:        NotificationType.OK,
      userAction:  NotificationUserAction.PENDING
    };

    this.notificationService.observeNotification(NOTIFICATION_DELETE_VERANSTALTUNG_FAILURE)
        .subscribe((myNotification) => {
          if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
            this.deleteLoading = false;
          }
        });

    this.notificationService.showNotification(notification);
  }


  private handleWettkampfResponseArraySuccess(response: BogenligaResponse<WettkampfDO[]>): void {
    this.allWettkampf = [];
    this.allWettkampf = response.payload;
    this.allWettkampf = this.allWettkampf.filter((wettkampf) => wettkampf.wettkampfVeranstaltungsId === this.currentVeranstaltung.id);

    if (this.allWettkampf.filter((wettkampf) => wettkampf.wettkampfTag === 1).length === 0) {
      this.currentWettkampftag_1 = new WettkampfDO();


    } else {
      this.currentWettkampftag_1 = this.allWettkampf.filter((wettkampf) => wettkampf.wettkampfTag === 1)[0];
      console.log('==> handleWettkampfResponseArraySuccess: wettkampfTag 1 existiert schon...');

    }

    if (this.allWettkampf.filter((wettkampf) => wettkampf.wettkampfTag === 2).length === 0) {
      this.currentWettkampftag_2 = new WettkampfDO();


    } else {
      this.currentWettkampftag_2 = this.allWettkampf.filter((wettkampf) => wettkampf.wettkampfTag === 2)[0];

    }

    if (this.allWettkampf.filter((wettkampf) => wettkampf.wettkampfTag === 3).length === 0) {
      this.currentWettkampftag_3 = new WettkampfDO();

    } else {
      this.currentWettkampftag_3 = this.allWettkampf.filter((wettkampf) => wettkampf.wettkampfTag === 3)[0];
    }

    if (this.allWettkampf.filter((wettkampf) => wettkampf.wettkampfTag === 4).length === 0) {
      this.currentWettkampftag_4 = new WettkampfDO();

    } else {
      this.currentWettkampftag_4 = this.allWettkampf.filter((wettkampf) => wettkampf.wettkampfTag === 4)[0];
    }


    this.loading = false;
  }

  private handleWettkampfResponseArrayFailure(response: BogenligaResponse<WettkampfDTO[]>): void {
    // this.allUsersTag1 = [];
    // this.allUsersTag2 = [];
    // this.allUsersTag3 = [];
    // this.allUsersTag4 = [];
    this.loading = false;
  }

  private handleLizenzResponseArraySuccess(response: BogenligaResponse<LizenzDO[]>): void {
    this.allKampfrichterLizenzen = response.payload;
    this.allKampfrichterLizenzen = this.allKampfrichterLizenzen.filter((lizenz) => lizenz.lizenztyp === 'Kampfrichter');
    console.log('allKampfrichterLizenzen:');
    console.log(this.allKampfrichterLizenzen);
  }

  private handleLizenzResponseArrayFailure(response: BogenligaResponse<LizenzDO[]>): void {
    this.allKampfrichterLizenzen = [];
  }

  private handleDsbMitgliedResponseArraySuccess(response: BogenligaResponse<DsbMitgliedDO[]>): void {
    const allDsbMitglieder: Array<DsbMitgliedDO> = response.payload;
    this.allDsbMitgliederWithKampfrichterLizenz = [];
    for (const i of Object.keys(this.allKampfrichterLizenzen)) {
      this.allDsbMitgliederWithKampfrichterLizenz.push(allDsbMitglieder.filter((dsbMitglied) => dsbMitglied.id === this.allKampfrichterLizenzen[i].lizenzDsbMitgliedId)[0]);
    }
    console.log('allDsbMitgliederWithKampfrichterLizenz:');
    console.log(this.allDsbMitgliederWithKampfrichterLizenz);
  }

  private handleDsbMitgliedResponseArrayFailure(response: BogenligaResponse<DsbMitgliedDO[]>): void {
    this.allDsbMitgliederWithKampfrichterLizenz = [];
  }

  private handleBenutzerRolleResponseArraySuccess(response: BogenligaResponse<BenutzerRolleDO[]>): void {
    const allBenutzer: Array<BenutzerRolleDO> = response.payload;
    const validDsbMitglieder: Array<number> = [];
    this.allBenutzerWithKampfrichterLizenz = [];
    for (const i of Object.keys(this.allDsbMitgliederWithKampfrichterLizenz)) {
      if (!isNullOrUndefined(this.allDsbMitgliederWithKampfrichterLizenz[i].userId)) {
        console.log(i);
        validDsbMitglieder.push(Number(i));
      }
    }
    for (const i of Object.keys(validDsbMitglieder)) {
      this.allBenutzerWithKampfrichterLizenz.push(allBenutzer.filter((benutzerRolle) => benutzerRolle.id === this.allDsbMitgliederWithKampfrichterLizenz[validDsbMitglieder[i]].userId)[0]);
    }

    console.log('allBenutzerWithKampfrichterLizenz:');
    console.log(this.allBenutzerWithKampfrichterLizenz);
    // this.allUsersTag1 = [];
    // this.allUsersTag2 = [];
    // this.allUsersTag3 = [];
    // this.allUsersTag4 = [];
    // this.allUsersTag1 = response.payload;
    // this.allUsersTag2 = response.payload;
    // this.allUsersTag3 = response.payload;
    // this.allUsersTag4 = response.payload;
    // this.allUsersTag1 = this.allUsersTag1.filter((user) => user.roleId === 5);
    // this.allUsersTag2 = this.allUsersTag2.filter((user) => user.roleId === 5);
    // this.allUsersTag3 = this.allUsersTag3.filter((user) => user.roleId === 5);
    // this.allUsersTag4 = this.allUsersTag4.filter((user) => user.roleId === 5);

    this.loading = false;
  }

  private handleBenutzerRolleResponseArrayFailure(response: BogenligaResponse<BenutzerRolleDTO[]>): void {
    this.allBenutzerWithKampfrichterLizenz = [];
    // this.allUsersTag1 = [];
    // this.allUsersTag2 = [];
    // this.allUsersTag3 = [];
    // this.allUsersTag4 = [];
    this.loading = false;
  }

  // TODO: Fix this method so that it also works when the wettkampfID is null (the createWettkampf-method instead of updateWettkampf gets called
  private handleKampfrichterResponseArraySuccess(
    response: BogenligaResponse<KampfrichterDO[]>
  ): void {
    let allKampfrichter: Array<KampfrichterDO> = [];

    // TODO: Delete the following lines
    // for (let i = 0; i < 3; i++) {
    //   allKampfrichter[i] = new KampfrichterDO();
    //   allKampfrichter[i].id = i;
    // }
    // allKampfrichter[0].id = 5;
    // allKampfrichter[0].wettkampfID = 30;
    // allKampfrichter[0].leitend = false;

    allKampfrichter = response.payload;

    // console.log('==> handleKampfrichterResponseArraySuccess: allKampfrichter-ID: ' + this.allKampfrichter[0].id);
    // console.log('==> handleKampfrichterResponseArraySuccess: KampfrichterTag1-ID: ' + this.kampfrichterTag1[0]);
    // console.log(' ==> response.payload: ' + response.result);

    this.kampfrichterTag1 = [];

    allKampfrichter.filter((kampfrichter) => kampfrichter.wettkampfID === this.currentWettkampftag_1.id).forEach(kampfrichter => this.kampfrichterTag1.push(Object.assign({}, kampfrichter)));

    // this.kampfrichterTag1.push(allKampfrichter.filter((kampfrichter) => kampfrichter.wettkampfID ===
    // this.currentWettkampftag_1.id)); // [0]? TODO: Make sure, that allUsersTag1 are already loaded
    if (this.kampfrichterTag1[0] !== undefined) {
      for (const iter of Object.keys(this.kampfrichterTag1)) {
        this.initiallySelectedKampfrichterTag1.push(this.allBenutzerWithKampfrichterLizenz.filter((user) => user.id === this.kampfrichterTag1[iter].id)[0]);
      }
    }

    this.initiallySelectedKampfrichterTag1.forEach((val) => this.selectedKampfrichterTag1.push(Object.assign({}, val)));
    this.notSelectedKampfrichterWettkampftag1 = this.allBenutzerWithKampfrichterLizenz.filter((user) => this.initiallySelectedKampfrichterTag1.indexOf(user) < 0);

    console.log('All initial Kampfrichter for any Wettkampf:');
    console.log(allKampfrichter);
    console.log('All initial KampfrichterTag1:');
    console.log(this.kampfrichterTag1);
    console.log('All initiallySelectedKampfrichterTag1:');
    console.log(this.initiallySelectedKampfrichterTag1);
    console.log('All selectedKampfrichterTag1:');
    console.log(this.selectedKampfrichterTag1);
    console.log('All initial notSelectedKampfrichterWettkampftag1:');
    console.log(this.notSelectedKampfrichterWettkampftag1);

    // TODO: Write all changes for the other days too

    this.kampfrichterTag2 = [];

    allKampfrichter.filter((kampfrichter) => kampfrichter.wettkampfID === this.currentWettkampftag_2.id).forEach((kampfrichter) => this.kampfrichterTag2.push(Object.assign({}, kampfrichter)));

    // this.kampfrichterTag1.push(allKampfrichter.filter((kampfrichter) => kampfrichter.wettkampfID ===
    // this.currentWettkampftag_1.id)); // [0]? TODO: Make sure, that allUsersTag1 are already loaded
    if (this.kampfrichterTag2[0] !== undefined) {
      for (const iter of Object.keys(this.kampfrichterTag2)) {
        this.initiallySelectedKampfrichterTag2.push(this.allBenutzerWithKampfrichterLizenz.filter((user) => user.id === this.kampfrichterTag2[iter].id)[0]);
      }
    }

    this.initiallySelectedKampfrichterTag2.forEach((val) => this.selectedKampfrichterTag2.push(Object.assign({}, val)));
    this.notSelectedKampfrichterWettkampftag2 = this.allBenutzerWithKampfrichterLizenz.filter((user) => this.initiallySelectedKampfrichterTag2.indexOf(user) < 0);


    this.kampfrichterTag3 = [];

    allKampfrichter.filter((kampfrichter) => kampfrichter.wettkampfID === this.currentWettkampftag_3.id).forEach((kampfrichter) => this.kampfrichterTag3.push(Object.assign({}, kampfrichter)));

    // this.kampfrichterTag1.push(allKampfrichter.filter((kampfrichter) => kampfrichter.wettkampfID ===
    // this.currentWettkampftag_1.id)); // [0]? TODO: Make sure, that allUsersTag1 are already loaded
    if (this.kampfrichterTag3[0] !== undefined) {
      for (const iter of Object.keys(this.kampfrichterTag3)) {
        this.initiallySelectedKampfrichterTag3.push(this.allBenutzerWithKampfrichterLizenz.filter((user) => user.id === this.kampfrichterTag3[iter].id)[0]);
      }
    }

    this.initiallySelectedKampfrichterTag3.forEach((val) => this.selectedKampfrichterTag3.push(Object.assign({}, val)));
    this.notSelectedKampfrichterWettkampftag3 = this.allBenutzerWithKampfrichterLizenz.filter((user) => this.initiallySelectedKampfrichterTag3.indexOf(user) < 0);


    this.kampfrichterTag4 = [];

    allKampfrichter.filter((kampfrichter) => kampfrichter.wettkampfID === this.currentWettkampftag_4.id).forEach((kampfrichter) => this.kampfrichterTag4.push(Object.assign({}, kampfrichter)));

    // this.kampfrichterTag1.push(allKampfrichter.filter((kampfrichter) => kampfrichter.wettkampfID ===
    // this.currentWettkampftag_1.id)); // [0]? TODO: Make sure, that allUsersTag1 are already loaded
    if (this.kampfrichterTag4[0] !== undefined) {
      for (const iter of Object.keys(this.kampfrichterTag4)) {
        this.initiallySelectedKampfrichterTag4.push(this.allBenutzerWithKampfrichterLizenz.filter((user) => user.id === this.kampfrichterTag4[iter].id)[0]);
      }
    }

    this.initiallySelectedKampfrichterTag4.forEach((val) => this.selectedKampfrichterTag4.push(Object.assign({}, val)));
    this.notSelectedKampfrichterWettkampftag4 = this.allBenutzerWithKampfrichterLizenz.filter((user) => this.initiallySelectedKampfrichterTag4.indexOf(user) < 0);





    // this.kampfrichterTag2 = allKampfrichter.filter((kampfrichter) => kampfrichter.wettkampfID === this.currentWettkampftag_2.id);
    // for (const iter of Object.keys(this.kampfrichterTag2)) {
    //   this.selectedKampfrichterTag2.push(this.allUsersTag2.filter((user) => user.id === this.kampfrichterTag2[iter].id)[0]);
    // }
    // this.kampfrichterTag3 = allKampfrichter.filter((kampfrichter) => kampfrichter.wettkampfID === this.currentWettkampftag_3.id);
    // for (const iter of Object.keys(this.kampfrichterTag3)) {
    //   this.selectedKampfrichterTag3.push(this.allUsersTag3.filter((user) => user.id === this.kampfrichterTag3[iter].id)[0]);
    // }
    // this.kampfrichterTag4 = allKampfrichter.filter((kampfrichter) => kampfrichter.wettkampfID === this.currentWettkampftag_4.id);
    // for (const iter of Object.keys(this.kampfrichterTag4)) {
    //   this.selectedKampfrichterTag4.push(this.allUsersTag4.filter((user) => user.id === this.kampfrichterTag4[iter].id)[0]);
    // }
    // console.log('==> handleKampfrichterResponseArraySuccess: allKampfrichter-ID v2: ' + allKampfrichter[0].id);

    this.loading = false;
  }

  private handleKampfrichterResponseArrayFailure(response: BogenligaResponse<KampfrichterDTO[]>): void {
    // this.allKampfrichter = [];
    this.loading = false;
  }
}
