import {Component, OnInit} from '@angular/core';
import {LizenzDataProviderService} from '../../../../../services/lizenz-data-provider.service';
import {BogenligaResponse} from '../../../../../../shared/data-provider';
import {isUndefined} from '../../../../../../shared/functions';
import {ActivatedRoute, Router} from '@angular/router';
import {
  Notification,
  NotificationOrigin,
  NotificationService,
  NotificationSeverity,
  NotificationType,
  NotificationUserAction
} from '../../../../../../shared/services';
import {VeranstaltungDO} from '@verwaltung/types/veranstaltung-do.class';
import {LizenzDO} from '@verwaltung/types/lizenz-do.class';
import {DsbMitgliedDO} from '@verwaltung/types/dsb-mitglied-do.class';
import {VereinDO} from '@verwaltung/types/verein-do.class';
import {MannschaftsMitgliedDO} from '@verwaltung/types/mannschaftsmitglied-do.class';
import {DsbMitgliedDataProviderService} from '@verwaltung/services/dsb-mitglied-data-provider.service';
import {MannschaftsmitgliedDataProviderService} from '@verwaltung/services/mannschaftsmitglied-data-provider.service';
import {VereinDataProviderService} from '@verwaltung/services/verein-data-provider.service';
import {DsbMitgliedDTO} from '@verwaltung/types/datatransfer/dsb-mitglied-dto.class';
import {DsbMannschaftDO} from '@verwaltung/types/dsb-mannschaft-do.class';
import {toTableRows} from '@shared/components';
import {MannschaftsmitgliedDTO} from '@verwaltung/types/datatransfer/mannschaftsmitglied-dto.class';
import {TableRow} from '@shared/components/tables/types/table-row.class';
import {DsbMannschaftDataProviderService} from '@verwaltung/services/dsb-mannschaft-data-provider.service';
import {VeranstaltungDataProviderService} from '@verwaltung/services/veranstaltung-data-provider.service';


const ID_PATH_PARAM = 'id';

@Component({
  selector:    'bla-lizenz',
  templateUrl: './lizenz.component.html',
  styleUrls:   ['./lizenz.component.scss']
})


export class LizenzComponent implements OnInit {

  constructor(private router: Router,
              private lizenzService: LizenzDataProviderService,
              private dsbMitgliedProvider: DsbMitgliedDataProviderService,
              private mannschaftMitgliedProvider: MannschaftsmitgliedDataProviderService,
              private mannschaftProvider: DsbMannschaftDataProviderService,
              private route: ActivatedRoute,
              private veranstaltungProvider: VeranstaltungDataProviderService,
              private vereinProvider: VereinDataProviderService) {
  }

  public currentVeranstaltung: VeranstaltungDO = new VeranstaltungDO();

  private members: Map<number, MannschaftsMitgliedDO> = new Map<number, MannschaftsMitgliedDO>();

  htmlToAdd: string;

  public rows: TableRow[];
  public currentMannschaft: DsbMannschaftDO = new DsbMannschaftDO();
  public ligen: Array<VeranstaltungDO> = [new VeranstaltungDO()];

  /**
   * Called when component is initialized.
   *
   * Initializes the match objects needed for template bindings,
   * then reads the matchIds from url and gets them via schusszettel-service.
   */
  ngOnInit() {

    this.loadVeranstaltungen();

    this.route.params.subscribe((params) => {
      if (!isUndefined(params[ID_PATH_PARAM])) {
        const id = params[ID_PATH_PARAM];
        console.log('params: ' + params[ID_PATH_PARAM]);
        if (id === 'add') {
          this.currentMannschaft = new DsbMannschaftDO();
        } else {
          this.loadById(params[ID_PATH_PARAM]);
        }
      }
    });
  }

  private loadById(id: number) {
    this.mannschaftProvider.findById(id)
        .then((response: BogenligaResponse<DsbMannschaftDO>) => this.handleSuccess(response));
  }

  private handleSuccess(response: BogenligaResponse<DsbMannschaftDO>) {
    this.currentMannschaft = response.payload;
    console.log(this.currentMannschaft.id);

    // Klappliste im Dialog mit dem korrekten Wert (aktuell Veranstalung, in der die Mannschaft gemeldet ist) vorbelegen
    this.currentVeranstaltung = this.ligen.filter((liga) => liga.id === this.currentMannschaft.veranstaltungId)[0];

    console.log(this.currentVeranstaltung);

    this.loadTableRows();
  }

  private loadTableRows() {

    this.dsbMitgliedProvider.findAllByTeamId(this.currentMannschaft.id)
        .then((response: BogenligaResponse<DsbMitgliedDTO[]>) => this.handleLoadTableRowsSuccess(response))
        .catch((response: BogenligaResponse<DsbMitgliedDTO[]>) => this.handleLoadTableRowsFailure(response));
  }

  private handleLoadTableRowsFailure(response: BogenligaResponse<DsbMitgliedDTO[]>): void {
    this.rows = [];
  }

  private handleLoadTableRowsSuccess(response: BogenligaResponse<DsbMitgliedDTO[]>): void {
    this.rows = []; // reset array to ensure change detection
    this.rows = toTableRows(response.payload);
    response.payload.forEach((member) => this.addMember(member));
  }

  // adds the member to map members(dsbMitgliedId, Mannschaftsmitglied)
  private addMember(member: DsbMitgliedDTO): void {
    this.mannschaftMitgliedProvider.findByMemberAndTeamId(member.id, this.currentMannschaft.id)
        .then((response: BogenligaResponse<MannschaftsmitgliedDTO>) => this.members.set(response.payload.dsbMitgliedId, response.payload))
        .catch((response: BogenligaResponse<MannschaftsmitgliedDTO>) => console.log(response.payload));
  }

  private loadVeranstaltungen() {
    this.veranstaltungProvider.findAll()
        .then((response: BogenligaResponse<VeranstaltungDO[]>) => this.handleVeranstaltungSuccess(response));
  }

  private handleVeranstaltungSuccess(response: BogenligaResponse<VeranstaltungDO[]>) {
    this.ligen = [];
    this.ligen = response.payload;
    if (this.currentMannschaft.veranstaltungId != null) {
      this.currentVeranstaltung = this.ligen.filter((liga) => liga.id === this.currentMannschaft.veranstaltungId)[0];
    } else {
      this.currentVeranstaltung = this.ligen[0];
    }
  }

  createData() {
    this.htmlToAdd = '';
    this.members.forEach((key) => this.testfunc1(key));
  }


  async testfunc1(key: MannschaftsMitgliedDO) {
    let lizenznummer = '';
    this.lizenzService.findByDsbMitgliedId(key.dsbMitgliedId).then((lizenzResponse: BogenligaResponse<LizenzDO[]>) => {
      let lizenzen: LizenzDO[] = [new LizenzDO()];
      lizenzen = lizenzResponse.payload;
      lizenznummer = lizenzen[0].lizenznummer.toString();
      const mitglieds = this.dsbMitgliedProvider.findById(key.dsbMitgliedId);
      mitglieds.then((mitglieder: BogenligaResponse<DsbMitgliedDO>) => {
        const mitglied: DsbMitgliedDO = mitglieder.payload;
        this.vereinProvider.findById(mitglied.vereinsId).then((vereine: BogenligaResponse<VereinDO>) => {
          const verein: VereinDO = vereine.payload;
          if (this.htmlToAdd.length === 0) {
            this.htmlToAdd = '<h1>Lizenz</h1>';
          } else {
            this.htmlToAdd += '<p>d</p><h1>Lizenz</h1>';
          }
          this.htmlToAdd +=
            '<table>' +
            '<tr>' +
            '<h2 class="row" style="font-weight: bold; font-size: 20px;">Lizenznummer: ' + lizenznummer + '</h2>' +
            '<h2 class="row" style="font-weight: bold; font-size: 16px;">Name: ' + mitglied.nachname + '</h2>' +
            '<h2 class="row" style="font-weight: bold; font-size: 16px;">Vorname: ' + mitglied.vorname + '</h2>' +
            '<h2 class="row" style="font-weight: bold; font-size: 16px;">Verein: ' + verein.name + '</h2>' +
            '<h2 class="row" style="font-weight: bold; font-size: 16px;">Liga: ' + this.currentVeranstaltung.ligaName + '</h2>' +
            '<h2 class="row" style="font-weight: bold; font-size: 16px;">Sportjahr: ' + this.currentVeranstaltung.sportjahr.toString() + '</h2>' +
            '<h2 class="row" style="font-weight: bold; font-size: 16px;"> </h2>' +
            '<h2 class="row" style="font-weight: bold; font-size: 16px;"> </h2>' +
            '</tr>' +
            '</table>' +
            '<table class="td_spacing">' +
            '<tr>' +
            '<h2 class="row" style="font-weight: bold; font-size: 20px;">Wettkampftage teilgenommen:</h2>' +
            '</tr>' +
            '<tr class="boxes">' +
            '<td class="box">1' +
            '</td>' +
            '<td class="fillerbox1">' +
            '</td>' +
            '<td class="unterschrift">Unterschrift:' +
            '</td>' +
            '<td></td>' +
            '</tr>' +
            '<tr class="boxes">' +
            '<td class="box">2' +
            '</td>' +
            '<td class="fillerbox1">' +
            '</td>' +
            '<td class="unterschrift">Unterschrift:' +
            '</td>' +
            '<td></td>' +
            '</tr>' +
            '<tr class="boxes">' +
            '<td class="box">3' +
            '</td>' +
            '<td class="fillerbox1">' +
            '</td>' +
            '<td class="unterschrift">Unterschrift:' +
            '</td>' +
            '<td></td>' +
            '</tr>' +
            '<tr class="boxes">' +
            '<td class="box">4' +
            '</td>' +
            '<td class="fillerbox1">' +
            '</td>' +
            '<td class="unterschrift">Unterschrift:' +
            '</td>' +
            '<td></td>' +
            '</tr>' +
            '</table>' +
            '<table class="td_spacing">' +
            '<tr>' +
            '<td class="td_spacing"></td>' +
            '<h2 class="row" style="font-weight: bold; font-size: 20px;">Unterschrift Schütze:</h2>' +
            '</tr>' +
            '</table>' +
            '<table>' +
            '<tr>' +
            '<h6>..............................................................................................' +
            '.........................................................................................</h6>' +
            '</tr>' +
            '</table>';
        });
      });
    });
  }
}

