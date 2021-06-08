import {Component, OnInit} from '@angular/core';
import {WETTKAMPF_CONFIG} from './wettkampf.config';
import {CommonComponentDirective, toTableRows} from '@shared/components';
import {BogenligaResponse, UriBuilder} from '@shared/data-provider';
import {TableRow} from '@shared/components/tables/types/table-row.class';
import {WETTKAMPF_TABLE_CONFIG} from './wettkampergebnis/tabelle.config';
import {WETTKAMPF_TABLE_EINZEL_CONFIG} from './wettkampergebnis/tabelle.einzel.config';
import {WETTKAMPF_TABLE_EINZELGESAMT_CONFIG} from '@wettkampf/components/wettkampf/wettkampergebnis/tabelle.einzelGesamt.config';
import {WettkampfErgebnisService} from '@wettkampf/services/wettkampf-ergebnis.service';
import {ActivatedRoute, Router} from '@angular/router';
import {isUndefined} from '@shared/functions';
import {MannschaftDataProviderService} from '@verwaltung/services/mannschaft-data-provider.service';
import {DsbMannschaftDO} from '@verwaltung/types/dsb-mannschaft-do.class';
import {MatchDataProviderService} from '@wettkampf/services/match-data-provider.service';
import {WettkampfDataProviderService} from '@verwaltung/services/wettkampf-data-provider.service';
import {PasseDataProviderService} from '@wettkampf/services/passe-data-provider.service';
import {VeranstaltungDataProviderService} from '@verwaltung/services/veranstaltung-data-provider.service';
import {VereinDataProviderService} from '@verwaltung/services/verein-data-provider.service';
import {WettkampfDO} from '@verwaltung/types/wettkampf-do.class';
import {PasseDoClass} from '@verwaltung/types/passe-do-class';
import {VeranstaltungDO} from '@verwaltung/types/veranstaltung-do.class';
import {VereinDO} from '@verwaltung/types/verein-do.class';
import {MatchDO} from '@verwaltung/types/match-do.class';
import {NotificationService} from '@shared/services';
import {DsbMitgliedDO} from '@verwaltung/types/dsb-mitglied-do.class';
import {DsbMitgliedDataProviderService} from '@verwaltung/services/dsb-mitglied-data-provider.service';
import {MannschaftsMitgliedDO} from '@verwaltung/types/mannschaftsmitglied-do.class';
import {MannschaftsmitgliedDataProviderService} from '@verwaltung/services/mannschaftsmitglied-data-provider.service';
import {environment} from '@environment';

const ID_PATH_PARAM = 'id';
@Component({
  selector:    'bla-mannschaft',
  templateUrl: './wettkampf.component.html',
  styleUrls:   ['./wettkampf.component.scss']
})

export class WettkampfComponent extends CommonComponentDirective implements OnInit {

  public show = false;
  public directMannschaft = null;
  public directWettkampf = null;
  public routes = null;
  public config = WETTKAMPF_CONFIG;
  public config_table = WETTKAMPF_TABLE_CONFIG;
  public config_einzel_table = WETTKAMPF_TABLE_EINZEL_CONFIG;
  public config_einzelGesamt_table = WETTKAMPF_TABLE_EINZELGESAMT_CONFIG;
  public jahre: Array<number> = [];
  public currentJahr: number;
  public vereine: Array<VereinDO> = [];
  public mannschaften: Array<DsbMannschaftDO> = [];
  public veranstaltungen: Array<VeranstaltungDO> = [];
  public currentVeranstaltung: VeranstaltungDO = new VeranstaltungDO();
  public currentMannschaft: DsbMannschaftDO = new DsbMannschaftDO();
  public currentVerein: VereinDO = new VereinDO();
  public multipleSelections = true;
  // Because we have several match tables, we need an array of arrays for the several Rows in each Table
  public rows: Array<TableRow[]> = new Array<TableRow[]>();
  public areVeranstaltungenLoading = true;
  public loadingData = false;
  public matches: Array<MatchDO[]> = [];
  public wettkaempfe: Array<WettkampfDO> = [];
  private passen: Array<PasseDoClass[]> = [];
  public mannschaftsmitglieder: Array<MannschaftsMitgliedDO> = [];
  public dsbMitglieder: Array<DsbMitgliedDO> = [];


  popup: boolean;
  gesamt = false;

  // Die Werte des Array's entspricht dem Inhalt von allen 4 Wettkampftagen. false = leere Tabelle, true = Tabelle mit Inhalt
  isTableFilled: Array<boolean> = [false, false, false, false];

  constructor(private veranstaltungsDataProvider: VeranstaltungDataProviderService,
              private vereinDataProvider: VereinDataProviderService,
              private wettkampfDataProviderService: WettkampfDataProviderService,
              private matchDataProviderService: MatchDataProviderService,
              private passeDataProviderService: PasseDataProviderService,
              private wettkampfErgebnisService: WettkampfErgebnisService,
              private mannschaftDataProvider: MannschaftDataProviderService,
              private dsbMitgliedDataProvider: DsbMitgliedDataProviderService,
              private mannschaftsmitgliedDataProvider: MannschaftsmitgliedDataProviderService,
              private router: Router,
              private route: ActivatedRoute,
              private notificationService: NotificationService) {
    super();
  }

  /**
   * Gets the value from path if Wettkampfergebnisse page is called. Starts after than loading of all Veranstaltungen
   * @see this.loadVeranstaltungen
   */
  ngOnInit() {
    this.route.params.subscribe((params) => {


      if (!isUndefined(params['Wettkampf']) && !isUndefined(params['Mannschaft'])) {
        this.directWettkampf = parseInt(params['Wettkampf'], 10);
        this.directMannschaft = parseInt(params['Mannschaft'], 10);
      } else if (!isUndefined(params['Wettkampf'])) {
        this.directWettkampf = parseInt(params['Wettkampf'], 10);
      }

    });
    this.loadVeranstaltungen()
        .then(() => {
          this.loadErgebnisse(this.currentMannschaft);
      });
  }

  /**
   * Loads the currently selected verein
   * @param vereinId | loads the verein with this Id
   */
  public loadVerein(vereinId: number): void {
    this.vereinDataProvider.findById(vereinId)
        .then((response: BogenligaResponse<VereinDO>) => this.handleLoadVerein(response))
        .catch((response: BogenligaResponse<VereinDO>) => this.handleLoadVerein(null));
    document.getElementById('vereinsinformationen').classList.remove('hidden');
  }

  /**
   * Sets the currently selected verein to the response
   * @param response | sets the current verein to the response
   */
  public handleLoadVerein(response: BogenligaResponse<VereinDO>) {
    this.currentVerein = response.payload;
  }

  /**
   * At first the selected rows throw rowNumber will be hidden depending on what statistic will be loaded.
   * Based on the IDs of the rows using for-loop the appropriate match-days will be loaded.
   * Depending on the row number the table config_table will be loaded.
   * Create Results for a Match encounter from a single Wettkampf and push it to this.rows. Rows is used to get the
   * values in the correct table in wettkampf.component.html
   * @param selectedMannschaft | Is this.currentMannschaft or undefined.
   * If this.currentMannschaft all match encounters from one team get created, else from all.
   * At the end the button for printing will be hidden so that its only available for 'Einzelstatistik'.
   */
  public loadErgebnisse(selectedMannschaft: DsbMannschaftDO) {
    for (let i = 0; i < 4; i++) {
      let rowNumber = 'row';
      rowNumber += i;
      document.getElementById(rowNumber).classList.remove('hidden');
      rowNumber += '1';
      document.getElementById(rowNumber).classList.add('hidden');
    }
    for (let i = 0; i <= 4; i++) {
      let tableNumber = 'Table';
      tableNumber += i;
      if (i === 0) {
        document.getElementById(tableNumber).classList.add('hidden');
      } else {
        document.getElementById(tableNumber).classList.remove('hidden');
      }
    }

    this.rows = [];
    for (let i = 0; i < this.wettkaempfe.length; i++) {
      this.rows.push((toTableRows(this.wettkampfErgebnisService.createErgebnisse(this.currentJahr, selectedMannschaft,
        this.mannschaften, this.currentVeranstaltung, this.matches[i], this.passen[i]))));
    }

    // This loop saves that the table is either empty or not. If table empty -> don't show on frontend
    for (let i = 0; i < this.rows.length; i++) {
      if (this.rows[i].length > 0) {
        this.isTableFilled[i] = true;
      }
    }

    document.getElementById('einzeldruckButton').classList.add('hidden');
    // hide verein information if the user presses "Alle Mannschaften anzeigen"
    if (selectedMannschaft === undefined) {
      document.getElementById('vereinsinformationen').classList.add('hidden');
    }
    document.getElementById('gesamtdruckButton').classList.add('hidden');
  }

  /* loadEinzelstatistik
  Die ersten beiden for-Schleifen dienen dazu die jeweilige Reihe/Tabelle entweder zu verstecken oder anzuzeigen.
  Desweiteren wird hier die Tabelle befüllt für die Einzelstatistik der Schützen (die zugehörigen Methoden sind in wettkampf-ereignis-service.ts zu finden)
  Am Ende wird der Button zum drucken der 'Einzelstatistik' eingeblendet da er hierfür relevant ist.
   */
  public loadEinzelstatistik(selectedMannschaft: DsbMannschaftDO) {

    for (let i = 0; i < 4; i++) {
      let rowNumber = 'row';
      rowNumber += i;
      document.getElementById(rowNumber).classList.add('hidden');
      rowNumber += '1';
      document.getElementById(rowNumber).classList.remove('hidden');
    }
    for (let i = 0; i <= 4; i++) {
      let tableNumber = 'Table';
      tableNumber += i;
      if (i === 0) {
        document.getElementById(tableNumber).classList.add('hidden');
      } else {
        document.getElementById(tableNumber).classList.remove('hidden');
      }
    }

    this.rows = [];
    for (let i = 0; i < this.wettkaempfe.length; i++) {
      this.rows.push((toTableRows(this.wettkampfErgebnisService.createEinzelErgebnisse(this.dsbMitglieder, this.mannschaftsmitglieder, this.currentJahr, selectedMannschaft,
        this.passen[i]))));
    }


    document.getElementById('einzeldruckButton').classList.remove('hidden');
    document.getElementById('gesamtdruckButton').classList.add('hidden');
  }

  /* loadGesamtstatistik
   Die ersten beiden for-Schleifen dienen dazu die jeweilige Reihe/Tabelle entweder zu verstecken oder anzuzeigen.
   Desweiteren wird hier die Tabelle befüllt für die Gesamtstatistik der Schützen (die zugehörigen Methoden sind in wettkampf-ereignis-service.ts zu finden)
   Am Ende wird der Button zum drucken der 'Einzelstatistik' eingeblendet da er hierfür relevant ist.
   */
  public loadGesamtstatistik(selectedMannschaft: DsbMannschaftDO) {

    for (let i = 0; i < 4; i++) {
      let rowNumber = 'row';
      rowNumber += i;
      document.getElementById(rowNumber).classList.add('hidden');
      rowNumber += '1';
      document.getElementById(rowNumber).classList.add('hidden');
    }
    for (let i = 0; i <= 4; i++) {
      let tableNumber = 'Table';
      tableNumber += i;
      if (i === 0) {
        document.getElementById(tableNumber).classList.remove('hidden');
      } else {
        document.getElementById(tableNumber).classList.add('hidden');
      }
    }

    this.rows = [];

    this.rows.push((toTableRows(this.wettkampfErgebnisService.createGesamtErgebnisse(this.dsbMitglieder, this.mannschaftsmitglieder, this.currentJahr, this.matches[0], selectedMannschaft,
      this.passen[0]))));



    document.getElementById('einzeldruckButton').classList.add('hidden');
    document.getElementById('gesamtdruckButton').classList.remove('hidden');

  }

  /* loadPopup
   ich werde in html aufgerufen,
   wenn ein Popup erscheinen soll das aufmerksam macht, dass die Mannschaft noch nicht ausgewählt wurde.
   Es werden die funktionen loadGesamtstatistik und loadEinzelstatistik im zusammenhang mit der variable gesamt aufgerufen,
   sofern diese in dem jeweiligen Button auf true oder false gesetzt ist.
   */
  public loadPopup(selectedMannschaft: DsbMannschaftDO) {
    if (!selectedMannschaft) {
      this.popup = true;
    } else if (this.gesamt) {
      this.loadGesamtstatistik(this.currentMannschaft);
    } else {
      this.loadEinzelstatistik(this.currentMannschaft);
      this.loadVerein(selectedMannschaft.vereinId);
    }
  }
  /*
   gesamtdruck
   Öffnet das Fenster um Gesamtstatistik zu drucken
   */
  public gesamtdruck() {

    let printContents = '<h2>Gesamtstatistik</h2>';
    printContents += '<br>';
    printContents += document.getElementById('titel').innerHTML;
    printContents += '<br>';
    printContents += document.getElementById('titel2').innerHTML;
    printContents += '<br>';
    printContents += document.getElementById('jahr').innerHTML;
    printContents += '<br><br>';
    printContents += document.getElementById('Table0').innerHTML;

    let htmlToPrint = '' +
      '<style type="text/css">' +
      'table th, table td {' +
      'padding: 5px; ' +
      '}' +
      ' #walkheader{border-left: none!important; border-right: none!important;}' +
      ' #Table1{padding: 4px; border-collapse:collapse; font; font-size:12pt;}' +
      ' #printHeader2 td{ border-bottom: solid black 1px; border-right: solid black 1px!important; }' +
      ' td{ border-bottom: solid black 1px; border-right: solid black 1px!important; border-left: solid black 1px!important; }' +
      '</style>';
    htmlToPrint += printContents;
    const printWindow = window.open('', '', 'height=800,width=800');
    printWindow.document.write('<html><head><title>Wettkampfergebnisse</title>');
    printWindow.document.write('</head><body >');
    printWindow.document.write(htmlToPrint);
    printWindow.document.write('<script>var spans = document.getElementsByTagName("fa-icon");  for (var i = 0; i<spans.length; i++) {' +
      ' spans[i].style.display = "none" };  </script>');
    printWindow.document.write('</body></html>');
    printWindow.print();
    printWindow.document.close();
  }

  /**
   * Get the data from the currently selected Veranstaltung. Starts the loading chain for all Wettkaempfe
   * @see this.loadWettkaempfe
   * @param $event
   */
  public onSelect($event: VeranstaltungDO[]): void {

    this.currentVeranstaltung = $event.concat()[0];
    this.currentJahr = this.currentVeranstaltung.sportjahr;
    this.jahre[0] = this.currentJahr;
    this.clear();
    this.loadMannschaft(this.currentVeranstaltung.id);
    this.loadWettkaempfe(this.currentVeranstaltung.id);
  }

  private clear() {
    this.matches = [];
    this.passen = [];
    this.wettkaempfe = [];
    this.rows = [];
  }

  // backend-calls to get data from DB
  public async loadVeranstaltungen() {
    await this.veranstaltungsDataProvider.findAll()
        .then((response: BogenligaResponse<VeranstaltungDO[]>) => this.handleSuccessLoadVeranstaltungen(response))
        .catch((response: BogenligaResponse<VeranstaltungDO[]>) => this.veranstaltungen = []);


  }


  async handleSuccessLoadVeranstaltungen(response: BogenligaResponse<VeranstaltungDO[]>) {
    this.veranstaltungen = response.payload;
    if (this.directWettkampf != null) {
      for (const i of this.veranstaltungen) {
        if (this.directWettkampf === i.id) {
          this.currentVeranstaltung = i;
          break;
        }
        this.currentVeranstaltung = this.veranstaltungen[0];
      }
    } else {
      this.currentVeranstaltung = this.veranstaltungen[0];
    }
    this.areVeranstaltungenLoading = false;
    this.currentJahr = this.currentVeranstaltung.sportjahr;
    this.loadMannschaft(this.currentVeranstaltung.id);
    this.loadMitglieder();
    this.loadJahre();
    this.loadMannschaftsmitglieder();
    await this.loadWettkaempfe(this.currentVeranstaltung.id);
  }

  public loadMannschaft(veranstaltungsId: number) {
    this.mannschaftDataProvider.findAllByVeranstaltungsId(veranstaltungsId)
        .then((response: BogenligaResponse<DsbMannschaftDO[]>) => this.handleSuccessLoadMannschaft(response))
        .catch((response: BogenligaResponse<DsbMannschaftDO[]>) => this.mannschaften === []);
  }

  public handleSuccessLoadMannschaft(response: BogenligaResponse<DsbMannschaftDO[]>) {
    this.mannschaften = response.payload;
    if (this.directMannschaft != null) {
      for (const i of this.mannschaften) {
        if (this.directMannschaft === i.id) {
          this.mannschaften[0] = i;
        }
        this.currentMannschaft = this.mannschaften[0];
      }
    } else if (this.currentMannschaft !== null) {

      this.currentMannschaft = undefined;
    }
  }

  public loadJahre() {
    for (const i of this.veranstaltungen) {
      if (this.jahre.includes(i.sportjahr) === false) {
        this.jahre[this.jahre.length] = i.sportjahr;
      }
    }
  }

  public async loadWettkaempfe(veranstaltungsId: number) {
    await this.wettkampfDataProviderService.findAllByVeranstaltungId(veranstaltungsId)
        .then((response: BogenligaResponse<WettkampfDO[]>) => this.handleLoadWettkaempfe(response.payload))
        .catch((response: BogenligaResponse<VereinDO[]>) => this.handleLoadWettkaempfe([]));
  }

  /**
   * Load all matches and passen for all wettkaempfe. The index variable is used to make sure the loaded
   * WettkampfErgebnisse are put in correct order into this.rows
   * @param wettkaempfe the amount of wettkaempfe of one Veranstaltung
   */
  public async  handleLoadWettkaempfe(wettkaempfe: WettkampfDO[]) {
    this.wettkaempfe = this.wettkaempfe.concat(wettkaempfe);
    for (let index = 0; index < this.wettkaempfe.length; index++) {
      this.loadingData = true;
      await this.loadMatches(this.wettkaempfe[index].id, index);
    }
  }

  public async  loadMatches(wettkampfId: number, index: number) {
    await this.matchDataProviderService.findByWettkampfId(wettkampfId)
        .then((response: BogenligaResponse<MatchDO[]>) => this.handleSuccessLoadMatches(response.payload, wettkampfId, index))
        .catch((response: BogenligaResponse<MatchDO[]>) => this.handleSuccessLoadMatches([], wettkampfId, index));
  }


  public async  handleSuccessLoadMatches(matches: MatchDO[], wettkampfId: number, index: number) {
    this.matches[index] = matches;
    await this.loadPassen(wettkampfId, matches, index);
  }

  public async loadPassen(wettkampfId: number, matches: MatchDO[], index: number) {
    await this.passeDataProviderService.findByWettkampfId(wettkampfId)
        .then((response: BogenligaResponse<PasseDoClass[]>) => this.handleSuccessLoadPassen(response.payload, matches, index))
        .catch((response: BogenligaResponse<PasseDoClass[]>) => this.handleSuccessLoadPassen([], matches, index));
  }

  public handleSuccessLoadPassen(passen: PasseDoClass[], matches, index: number) {
    this.passen[index] = passen;
    // Insert the new generated WettkampfErgebnis[] into index from this.rows. This is nesessary because the backend
    // loading times are different and would cause a wrong order if we would just load then step by step.
    this.rows[index] = toTableRows(this.wettkampfErgebnisService.createErgebnisse(this.currentJahr, undefined,
      this.mannschaften, this.currentVeranstaltung, matches, passen));
    if (index === this.wettkaempfe.length - 1) {
      this.loadingData = false;
    }
  }
  // method to change the name to a default, in case if there isn't a Team to for currentMannschaft

  public getTitle(): string {
    let placeholder = ' ';
    if (this.currentMannschaft !== undefined) {
      placeholder = this.currentMannschaft.name;
    }
    return placeholder;
  }

  /*
  loadMitglieder:
  Es stellt einen Request an das Backend um alle Mitglieder in der Datenbank dsb_mitglied zu erhalten
  und diese dann in dem Array dsbMitglieder zu speichern.
   */
  public loadMitglieder() {
    this.dsbMitgliedDataProvider.findAll()
              .then((response: BogenligaResponse<DsbMitgliedDO[]>) => this.dsbMitglieder = response.payload)
              .catch((response: BogenligaResponse<DsbMitgliedDO[]>) => this.dsbMitglieder = []);
  }

  public loadMannschaftsmitglieder() {
    this.mannschaftsmitgliedDataProvider.findAll()
        .then((response: BogenligaResponse<MannschaftsMitgliedDO[]>) => this.mannschaftsmitglieder = response.payload)
        .catch((response: BogenligaResponse<MannschaftsMitgliedDO[]>) => this.mannschaftsmitglieder = []);
  }

  public onButtonDownload(path: string): string {
    return new UriBuilder()
      .fromPath(environment.backendBaseUrl)
      .path('v1/download')
      .path(path)
      .path('?veranstaltungsid=' + this.currentVeranstaltung.id + '&manschaftsid=' + this.currentMannschaft.id + '&jahr=' + this.currentJahr)
      .build();
  }
}
