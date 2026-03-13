import {Component, OnInit} from '@angular/core';
import {WETTKAMPF_CONFIG} from './wettkampf.config';
import {ButtonSize, ButtonType, CommonComponentDirective, toTableRows} from '@shared/components';
import {BogenligaResponse} from '@shared/data-provider';
import {TableRow} from '@shared/components/tables/types/table-row.class';
import {WETTKAMPF_TABLE_CONFIG} from './wettkampergebnis/tabelle.config';
import {WETTKAMPF_TABLE_EINZELGESAMT_CONFIG} from '@wettkampf/components/wettkampf/wettkampergebnis/tabelle.einzelGesamt.config';
import {WettkampfErgebnisService} from '@wettkampf/services/wettkampf-ergebnis.service';
import {DsbMannschaftDataProviderService} from '@verwaltung/services/dsb-mannschaft-data-provider.service';
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
import {CurrentUserService, OnOfflineService} from '@shared/services';
import {MannschaftsMitgliedDO} from '@verwaltung/types/mannschaftsmitglied-do.class';
import {SessionHandling} from '@shared/event-handling';
import {ActionButtonColors} from '@shared/components/buttons/button/actionbuttoncolors';
import {DecimalPipe} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {LigaDO} from '@verwaltung/types/liga-do.class';
import {TableLinkTarget} from '@shared/components/tables/types/table-column-link-target-type-enum';


interface Wettkampftag {
  id: number;
  name: string;
}

@Component({
  selector:    'bla-mannschaft',
  templateUrl: './wettkampf.component.html',
  styleUrls:   ['./wettkampf.component.scss'],
  providers: [DecimalPipe]
})

export class WettkampfComponent extends CommonComponentDirective implements OnInit {

  public providedLigaID: number | undefined; // Liga-ID aus Resolver
  public hasID = false;
  public show = false;
  public currentConfig = WETTKAMPF_TABLE_EINZELGESAMT_CONFIG;
  public config = WETTKAMPF_CONFIG;
  public mannschaftenConfig = WETTKAMPF_TABLE_CONFIG;
  public jahre: Array<VeranstaltungDO> = [];
  public currentJahr: number;
  public vereine: Array<VereinDO> = [];
  public mannschaften: Array<DsbMannschaftDO> = [];
  public veranstaltungen: Array<VeranstaltungDO> = [];
  public currentVeranstaltung: VeranstaltungDO = new VeranstaltungDO();
  public currentMannschaft: DsbMannschaftDO = new DsbMannschaftDO();
  public currentVerein: VereinDO = new VereinDO();
  public multipleSelections = true;
  public rows: Array<TableRow[]> = new Array<TableRow[]>();
  public areVeranstaltungenLoading = true;
  public loadingData = false;
  public isStatistikAllowed = false;
  public matches: Array<MatchDO[]> = [];
  public wettkaempfe: Array<WettkampfDO> = [];
  private passen: Array<PasseDoClass[]> = [];
  public mannschaftsmitglieder: Array<MannschaftsMitgliedDO> = [];
  public ActionButtonColors = ActionButtonColors;
  public selectedWettkampfTag: Wettkampftag;
  public currentWettkampftag = 0;
  public wettkampftage: Array<Wettkampftag> = [];
  private sessionHandling: SessionHandling;
  ButtonSize = ButtonSize;
  ButtonType = ButtonType;
  public alleTage: Array<Wettkampftag> = [
    {id: 0, name: 'MANNSCHAFTEN.DROPDOWNWETTKAMPFTAGE.OPTION1.LABEL'},
    {id: 1, name: 'MANNSCHAFTEN.DROPDOWNWETTKAMPFTAGE.OPTION2.LABEL'},
    {id: 2, name: 'MANNSCHAFTEN.DROPDOWNWETTKAMPFTAGE.OPTION3.LABEL'},
    {id: 3, name: 'MANNSCHAFTEN.DROPDOWNWETTKAMPFTAGE.OPTION4.LABEL'}
  ];

  // attributes for the line chart
  public showLineChart = false;
  public lineChartData = [];
  popup: boolean;

  constructor(
    private veranstaltungsDataProvider: VeranstaltungDataProviderService,
    private vereinDataProvider: VereinDataProviderService,
    private wettkampfDataProviderService: WettkampfDataProviderService,
    private matchDataProviderService: MatchDataProviderService,
    private passeDataProviderService: PasseDataProviderService,
    private wettkampfErgebnisService: WettkampfErgebnisService,
    private mannschaftDataProvider: DsbMannschaftDataProviderService,
    private currentUserService: CurrentUserService,
    private router: Router,
    private route: ActivatedRoute,
    private onOfflineService: OnOfflineService) {
    super();
    this.sessionHandling = new SessionHandling(this.currentUserService, this.onOfflineService);
  }

  /**
   * Gets the value from path if Wettkampfergebnisse page is called. Starts after than loading of all Veranstaltungen
   * @see this.loadVeranstaltungen
   */
  ngOnInit() {
    this.init();
  }

  async init() {
    const ligaFromResolver = this.route.snapshot.data['liga'] as LigaDO | null | undefined;
    this.providedLigaID = ligaFromResolver?.id ?? undefined;
    this.hasID = this.providedLigaID != null;

    if (this.providedLigaID != null) {
      await this.loadVeranstaltungen(this.providedLigaID);
    }
  }

  public buildMannschaftLink = (row: any, target: TableLinkTarget) => {
    if (target === TableLinkTarget.OWN) {
      return ['/vereine', row.payload.vereinId, row.payload.mannschaftId];
    } else {
      return ['/vereine', row.payload.opponentVereinId, row.payload.opponentId];
    }
  }

  printStatistics() {
    // Get the printable content
    const dropdownContents = document.getElementById('DropdownForPrintOut').innerHTML;
    const statsAndGraphContents = document.getElementById('StatsAndGraphForPrintOut').innerHTML;

    // Create a new container for printing
    const printContainer = document.createElement('div');
    printContainer.innerHTML = dropdownContents + statsAndGraphContents;

    // Create an iframe for printing
    const printFrame = document.createElement('iframe');
    document.body.appendChild(printFrame);

    const printDocument = printFrame.contentDocument || printFrame.contentWindow.document;
    printDocument.open();

    // Write the HTML and include the styles
    printDocument.write('<html><head><title>Print</title>');

    // Clone and append the current stylesheets to the print document
    const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'));
    styles.forEach( (style) => {
      printDocument.write(style.outerHTML);
    });

    printDocument.write('</head><body>');
    printDocument.write(printContainer.innerHTML);
    printDocument.write('</body></html>');
    printDocument.close();

    // Wait for the content to be loaded and then print
    printFrame.onload = () => {
      printFrame.contentWindow.focus();
      printFrame.contentWindow.print();

      // Clean up by removing the iframe after printing
      setTimeout(() => {
        document.body.removeChild(printFrame);
      }, 1000);
    };
  }

  /** When a MouseOver-Event is triggered, it will call this inMouseOver-function.
   *  This function calls the checkSessionExpired-function in the sessionHandling class and get a boolean value back.
   *  If the boolean value is true, then the page will be reloaded and due to the expired session, the user will
   *  be logged out automatically.
   */
  public onMouseOver(event: any) {
    const isExpired = this.sessionHandling.checkSessionExpired();
    if (isExpired) {
      window.location.reload();
    }
  }

  /**
   * Loads the currently selected verein
   * @param vereinId | loads the verein with this ID
   */
  public async loadVerein(vereinId: number) {
    await this.vereinDataProvider.findById(vereinId)
      .then((response: BogenligaResponse<VereinDO>) => this.handleLoadVerein(response))
      .catch(() => this.handleLoadVerein(null));
  }

  /**
   * Sets the currently selected verein to the response
   * @param response | sets the current verein to the response
   */
  public handleLoadVerein(response: BogenligaResponse<VereinDO>) {
    this.currentVerein = response.payload;
  }

  public async loadAllErgebnisse(selectedMannschaft: DsbMannschaftDO) {
    this.loadingData = true;
    await this.loadErgebnisse(selectedMannschaft);
    this.loadingData = false;
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
  public async loadErgebnisse(selectedMannschaft: DsbMannschaftDO) {
    this.isStatistikAllowed = true;
    await this.clearAllStatistikTables();

    this.rows = [];
    for (let i = 0; i < this.wettkaempfe.length; i++) {
      this.rows.push(toTableRows(this.wettkampfErgebnisService.createErgebnisse(this.currentJahr, selectedMannschaft,
        this.mannschaften, this.currentVeranstaltung, this.matches[i], this.passen[i])));
    }
    this.currentConfig = this.mannschaftenConfig;
  }

  private clear() {
    this.matches = [];
    this.passen = [];
    this.wettkaempfe = [];
    this.rows = [];
    this.mannschaften = [];

    this.currentVerein.name = undefined;
    this.currentVerein.regionName = '';
    this.currentVerein.website = '';
    this.currentVerein.description = '';
    this.currentVerein.icon = '';
    this.cleanLineChart();
  }

  /**
   * Backend call to load from the DB
   * Loads all veranstaltungen for the given ligaId and sets the years for the dropdown.
   * If there are no veranstaltungen, it will set loadingData to false to hide the loading spinner.
   * @param ligaId
   */
  public async loadVeranstaltungen(ligaId: number) {
    this.clear();
    this.loadingData = true;
    this.cleanLineChart();

    // Get all veranstaltungen for the given ligaId. If it fails, log the error and set empty values to prevent crashes in the frontend
    let response: BogenligaResponse<VeranstaltungDO[]>;
    try {
      response = await this.veranstaltungsDataProvider.findByLigaId(ligaId);
    } catch (e) {
      console.error('findByLigaId failed', e);
      this.veranstaltungen = [];
      this.currentVeranstaltung = new VeranstaltungDO();
      this.loadingData = false;
      return;
    }

    this.veranstaltungen = response.payload ?? [];
    this.areVeranstaltungenLoading = false;

    if (this.veranstaltungen.length === 0) {
      this.loadingData = false;
      return;
    }
    // Set the years based on the loaded veranstaltungen.
    this.handleSuccessLoadJahre(this.veranstaltungen);

    if (this.currentJahr == null && this.jahre.length > 0) {
      this.currentJahr = this.jahre[0].sportjahr;
    }

    try {
      await this.selectYear(this.currentJahr);
    } catch (e) {
      // In case of an error during selectYear, log the error and clear chart to remove stale data.
      console.error('selectYear failed', e);
      this.cleanLineChart();
    } finally {
      this.loadingData = false;
    }
  }

  /**
   *  When a year is selected, this function will be called. It sets the current year and calls selectYear
   * to load the data for the selected year.
   * @param year the selected year, can be a number or a string (if it comes from a dropdown), so we need to convert it to a number if it's a string
   */
  public async onSelectYear(year: number) {
    const y = typeof year === 'string' ? Number(year) : year;
    this.currentJahr = y;

    if (!this.veranstaltungen || this.veranstaltungen.length === 0) {
      console.warn('No veranstaltungen loaded yet, cannot select year');
      return;
    }

    await this.selectYear(y);
  }

  /**
   * This function is responsible for loading all data related to the selected year.
   * It finds the corresponding veranstaltung for the selected year, loads the mannschaften and wettkaempfe for that veranstaltung,
   * and sets the selected wettkampftag to the first one.
   * @param year the selected year for which the data should be loaded
   */
  private async selectYear(year: number) {
    if (!this.veranstaltungen || this.veranstaltungen.length === 0) {
      return;
    }

    const veranstaltung =
      this.veranstaltungen.find((x) => x.sportjahr === year) ?? this.veranstaltungen[0];

    if (!veranstaltung) { return; } // extra safety

    this.currentVeranstaltung = veranstaltung;

    await this.loadMannschaften(veranstaltung.id);
    await this.loadWettkaempfe(veranstaltung.id);

    this.selectedWettkampfTag = this.alleTage?.[0] ?? null;
    await this.loadStatistic();
  }

  public async loadMannschaften(veranstaltungsId: number) {
    await this.mannschaftDataProvider.findAllByVeranstaltungsId(veranstaltungsId)
      .then((response: BogenligaResponse<DsbMannschaftDO[]>) => {
        this.handleSuccessLoadMannschaft(response);
      })
      .catch(() => this.mannschaften === []);
  }

  public handleSuccessLoadMannschaft(response: BogenligaResponse<DsbMannschaftDO[]>) {
    this.mannschaften = response.payload;
    this.currentMannschaft = this.mannschaften[0];
    this.loadVerein(this.currentMannschaft.vereinId);
  }

  private handleSuccessLoadJahre(veranstaltungen: VeranstaltungDO[]) {
    this.jahre = veranstaltungen.sort((a, b) => b.sportjahr - a.sportjahr);
  }

  public async loadWettkaempfe(veranstaltungsId: number) {
    await this.wettkampfDataProviderService.findAllByVeranstaltungId(veranstaltungsId)
      .then((response: BogenligaResponse<WettkampfDO[]>) => this.handleLoadWettkaempfe(response.payload))
      .catch(() => this.handleLoadWettkaempfe([]));
    this.wettkampftage = this.alleTage.slice(0, this.wettkaempfe.length);
    this.selectedWettkampfTag = this.alleTage[0];
  }

  /**
   * Load all matches and passen for all wettkaempfe. The index variable is used to make sure the loaded
   * WettkampfErgebnisse are put in correct order into this.rows
   * @param wettkaempfe the amount of wettkaempfe of one Veranstaltung
   */
  public async handleLoadWettkaempfe(wettkaempfe: WettkampfDO[]) {
    this.wettkaempfe = wettkaempfe;

    // Erstelle ein Array von Promises für die `loadMatches`-Aufrufe
    const loadPromises = this.wettkaempfe.map((wettkampf, index) =>
      this.loadMatches(wettkampf.id, index)
    );

    // Warte, bis alle Promises abgeschlossen sind
    await Promise.all(loadPromises);
  }

  public async loadMatches(wettkampfId: number, index: number) {
    try {
      const response = await this.matchDataProviderService.findByWettkampfId(wettkampfId);
      await this.handleSuccessLoadMatches(response.payload, wettkampfId, index);
    } catch (e) {
      console.warn('loadMatches failed', wettkampfId, e);
      await this.handleSuccessLoadMatches([], wettkampfId, index);
    }
  }


  public async handleSuccessLoadMatches(matches: MatchDO[], wettkampfId: number, index: number) {
    this.matches[index] = matches;
    await this.loadPassen(wettkampfId, matches, index);
  }

  public async loadPassen(wettkampfId: number, matches: MatchDO[], index: number) {
    try {
      const response = await this.passeDataProviderService.findByWettkampfId(wettkampfId);
      this.handleSuccessLoadPassen(response.payload, matches, index);
    } catch (e) {
      console.warn('loadPassen failed', wettkampfId, e);
      this.handleSuccessLoadPassen([], matches, index);
    }
  }

  public handleSuccessLoadPassen(passen: PasseDoClass[], matches, index: number) {
    this.passen[index] = passen;
    // Insert the new generated WettkampfErgebnis[] into index from this.rows. This is necessary because the backend
    // loading times are different and would cause a wrong order if we would just load then step by step.
    this.rows[index] = toTableRows(this.wettkampfErgebnisService.createErgebnisse(this.currentJahr, undefined,
      this.mannschaften, this.currentVeranstaltung, matches, passen));
  }


  private cleanLineChart() {
    this.showLineChart = false;
    this.lineChartData  = [
      {
        data: [],
        label: '',
        backgroundColor: 'rgb(72, 122, 245)',
        borderColor: 'rgb(72, 122, 245)',
        pointBackgroundColor: 'rgb(72, 122, 245)',
        lineTension: 0,
        pointRadius: 6,
        fill: false}
    ];
  }

  private async clearAllStatistikTables() {
    // make everything invisible
    this.currentWettkampftag = 0;
    this.cleanLineChart();
  }

  public async loadStatistic() {
    this.isStatistikAllowed = true;
    this.cleanLineChart();
    await this.loadAllErgebnisse(undefined);
    this.onSelectWettkampfTag();
  }

  public onSelectWettkampfTag() {
    // Simply changes index of the table depending on the selected wettkampftag
    this.currentWettkampftag = this.selectedWettkampfTag.id;
  }

}
