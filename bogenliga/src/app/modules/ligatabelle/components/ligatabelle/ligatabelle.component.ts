import { Component, OnInit } from '@angular/core';
import { faSitemap, faUndo } from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonComponentDirective, toTableRows } from '@shared/components';
import { LIGATABELLE_TABLE_CONFIG, WETTKAEMPFE_CONFIG } from './ligatabelle.config';
import { VeranstaltungDO } from '@verwaltung/types/veranstaltung-do.class';
import { BogenligaResponse } from '@shared/data-provider';
import { VeranstaltungDataProviderService } from '@verwaltung/services/veranstaltung-data-provider.service';
import { LigatabelleDataProviderService } from '../../services/ligatabelle-data-provider.service';
import { TableRow } from '@shared/components/tables/types/table-row.class';
import { LigatabelleErgebnisDO } from '../../types/ligatabelle-ergebnis-do.class';
import { NotificationService } from '@shared/services/notification';
import { SportjahrVeranstaltungDO } from '@verwaltung/types/sportjahr-veranstaltung-do';
import { CurrentUserService, OnOfflineService } from '@shared/services';
import { SessionHandling } from '@shared/event-handling';
import { EinstellungenProviderService } from '@verwaltung/services/einstellungen-data-provider.service';
import { getActiveSportYear } from '@shared/functions/active-sportyear';
import { ActionButtonColors } from '@shared/components/buttons/button/actionbuttoncolors';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { WettkampfDO } from '@verwaltung/types/wettkampf-do.class';
import { WettkampfDataProviderService } from '@verwaltung/services/wettkampf-data-provider.service';
import { LigaDO } from '@verwaltung/types/liga-do.class';
import {slugifyLigaName} from "@shared/functions/slug-utils";
import {log} from "util";

interface Wettkampftag {
  id: number;
  name: string;
}

@Component({
  selector: 'bla-wettkaempfe',
  templateUrl: './ligatabelle.component.html',
  styleUrls: ['./ligatabelle.component.scss']
})
export class LigatabelleComponent extends CommonComponentDirective implements OnInit {

  private sessionHandling: SessionHandling;

  public zuDenLigadetailsIcon: IconProp = faSitemap;
  public zuruecksetzenIcon: IconProp = faUndo;

  public config = WETTKAEMPFE_CONFIG;
  public config_table = LIGATABELLE_TABLE_CONFIG;

  public PLACEHOLDER_VAR = 'Zur Suche Liga-Bezeichnung eingeben...';
  public buttonForward: number;
  public selectedVeranstaltungName: string;
  public ActionButtonColors = ActionButtonColors;

  public loading = true;
  public loadingLigatabelle = true;
  public multipleSelections = true;
  public rowsLigatabelle: TableRow[] = [];

  public providedLigaID: number | undefined; // Liga-ID aus Resolver
  private hasID = false;
  private hasVeranstaltung = true;

  private isDeselected = false;
  private remainingLigatabelleRequests: number;

  private loadedVeranstaltungen: Map<number, VeranstaltungDO[]>;
  public selectedVeranstaltung: VeranstaltungDO;
  public loadedYears: number[] = [];
  public availableYears: SportjahrVeranstaltungDO[] = [];
  public veranstaltungenForYear: VeranstaltungDO[] = [];

  private veranstaltungIdMap: Map<number, VeranstaltungDO>;

  private initialVeranstaltungId?: number;
  private initialWettkampfId?: number;
  private initialSelectionApplied = false;

  public selectedVeranstaltungId: number;
  public selectedYearId: number;
  public selectedItemId: number;
  private aktivesSportjahr: number;
  public selectedYearForVeranstaltung: number; // In der Tabelle selektiertes Sportjahr
  private istURLkorrekt = false;
  private currentWettkampf: WettkampfDO | null = null;
  private latestWettkampftagIndex: number = 0;
  public loadingWettkampftag = true;
  public wettkampf_ids: number[] = [];
  public selectedWettkampfTag: Wettkampftag;
  public wettkampftage: Array<Wettkampftag> = [];
  public alleTage: Array<Wettkampftag> = [
    { id: 1, name: 'MANNSCHAFTEN.DROPDOWNWETTKAMPFTAGE.OPTION1.LABEL' },
    { id: 2, name: 'MANNSCHAFTEN.DROPDOWNWETTKAMPFTAGE.OPTION2.LABEL' },
    { id: 3, name: 'MANNSCHAFTEN.DROPDOWNWETTKAMPFTAGE.OPTION3.LABEL' },
    { id: 4, name: 'MANNSCHAFTEN.DROPDOWNWETTKAMPFTAGE.OPTION4.LABEL' },
    { id: 0, name: 'MANNSCHAFTEN.DROPDOWNWETTKAMPFTAGE.OPTION5.LABEL' }
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private notificationService: NotificationService,
    private veranstaltungsDataProvider: VeranstaltungDataProviderService,
    private ligatabelleDataProvider: LigatabelleDataProviderService,
    private onOfflineService: OnOfflineService,
    private currentUserService: CurrentUserService,
    private einstellungenDataProvider: EinstellungenProviderService,
    private wettkampfDataProviderService: WettkampfDataProviderService
  ) {
    super();
    this.sessionHandling = new SessionHandling(this.currentUserService, this.onOfflineService);
  }

  async ngOnInit() {
    const state = window.history.state;
    console.log("State is: "+state);
    this.initialVeranstaltungId = state?.initialVeranstaltungId;
    this.initialWettkampfId = state?.initialWettkampfId;

    // Liga aus Resolver (QueryParam ?liga=...) übernehmen
    console.log("Lade Liga aus Resolver...");
    const ligaFromResolver = this.route.snapshot.data['liga'] as LigaDO | null | undefined;
    if (ligaFromResolver?.id != null) {
      this.providedLigaID = ligaFromResolver.id;
      this.hasID = true;
    } else {
      this.providedLigaID = undefined;
      this.hasID = false;
    }
    // Aktives Sportjahr setzen
    console.log("Aktives Sportjahr laden");
    if (!this.onOfflineService.isOffline()) {
      this.aktivesSportjahr = await getActiveSportYear(this.einstellungenDataProvider);
    }

    if (this.isDeselected === false) {
      console.log("Loading table data...");
      await this.loadTableData();
      console.log("Table data loaded.");
      this.notificationService.discardNotification();
    }
  }

  public loadVeranstaltungFromLigaIDAndSportYear(urlLigaID: number, selectedSportYear: number) {
    this.veranstaltungsDataProvider.findByLigaIdAndYear(urlLigaID, selectedSportYear)
      .then((response: BogenligaResponse<VeranstaltungDO>) => this.handleFindVeranstaltungSuccess(response))
      .catch((response: BogenligaResponse<VeranstaltungDO>) => this.handleFindVeranstaltungFailure(response));
  }

  private handleFindVeranstaltungSuccess(response: BogenligaResponse<VeranstaltungDO>): void {
    this.hasVeranstaltung = true;
    this.selectedItemId = response.payload.id;
  }

  private handleFindVeranstaltungFailure(error: any): void {
    this.hasVeranstaltung = false;
    // Bleibe auf /ligatabelle (ohne :id), UI zeigt dann „keine Veranstaltung“ bis Auswahl getroffen wird
    this.router.navigate(['/ligatabelle']);
  }

  public onMouseOver(event: any) {
    const isExpired = this.sessionHandling.checkSessionExpired();
    if (isExpired) {
      window.location.reload();
    }
  }

  private async loadTableData() {
    this.loadedYears = [];
    this.loadedVeranstaltungen = new Map();
    this.veranstaltungIdMap = new Map();

    // Jahre laden
    try {
      // Fetch all veranstaltungen for liga (Liga must be selected to show Ligatabelle anyway)
      console.log("providedLigaID:", this.providedLigaID);
      const veranstaltungenResponse = await this.veranstaltungsDataProvider.findByLigaId(this.providedLigaID);

      const allVeranstaltungen = veranstaltungenResponse.payload ?? [];

      if (allVeranstaltungen.length === 0) {
        console.log("No veranstaltungen found for liga.");
        return;
      }
      console.log("All Veranstaltungen:", allVeranstaltungen);

      // Fülle loadedYears Array anhand der geladenen Veranstaltungen
      for (const v of allVeranstaltungen) {
        if (!this.loadedYears.includes(v.sportjahr)) {
          this.loadedYears.push(v.sportjahr);
        }
      }

      // Absteigend sortieren (neuestes Jahr zuerst)
      this.loadedYears.sort((a, b) => b - a);

      // Fülle loadedVeranstaltungen Map anhand der geladenen Veranstaltungen
      this.loadedVeranstaltungen = new Map(
        allVeranstaltungen
          .sort((a, b) => b.sportjahr - a.sportjahr) // Sortiere absteigend nach sportjahr
          .map(v => [v.sportjahr, [v]])
      );

      console.log("Loaded Veranstaltungen:", this.loadedVeranstaltungen);

      // Initiale Veranstaltung/Sportjahr aus Router-State bevorzugen
      const explicitV = (this.initialVeranstaltungId != null)
        ? allVeranstaltungen.find(v => v.id === this.initialVeranstaltungId)
        : undefined;

      if (explicitV) {
        this.selectedVeranstaltung = explicitV;
        this.selectedVeranstaltungName = explicitV.name;
        this.selectedVeranstaltungId = explicitV.id;
        this.selectedYearForVeranstaltung = explicitV.sportjahr;
        this.buttonForward = explicitV.id;
        console.log("Selected Veranstaltung (from navigation state):", explicitV);
      } else {
        this.selectMostRecentVeranstaltung();
      }

      this.loadVeranstaltung(this.selectedVeranstaltung);

      this.loading = false;
      this.loadingLigatabelle = false;

    } catch (e) {
      this.loading = false;
      this.loadingLigatabelle = false;
      console.log(e);
    }
  }

  /**
   * Selects the most recent Veranstaltung for the selected Liga.
   */
  private selectMostRecentVeranstaltung() {
    // loadedVeranstaltungen ist mit Arrays der VeranstaltungDOs gefüllt, deswegen temporär mappen
   const [,tempselectedveranstaltung] = [...this.loadedVeranstaltungen].filter(
      ([year, _])=> (year <= this.aktivesSportjahr)).values().next().value;
   console.log("Aktives Sportjahr:", this.aktivesSportjahr);
   // Dann das Array-Element persistieren auf einen normalen VeranstaltungDOr
    this.selectedVeranstaltung = tempselectedveranstaltung[0]
    this.selectedVeranstaltungName = this.selectedVeranstaltung.name;
    this.selectedVeranstaltungId = this.selectedVeranstaltung.id;
    this.selectedYearForVeranstaltung = this.selectedVeranstaltung.sportjahr;
    this.buttonForward = this.selectedVeranstaltung.id;
    console.log("Selected Veranstaltung:", this.selectedVeranstaltung);
  }

  private loadLigaTableRows() {
    console.trace()
    this.loadingLigatabelle = true;
    console.log("selected id:", this.selectedVeranstaltung.id);
    console.log("other selected id:", this.selectedVeranstaltungId)
    this.ligatabelleDataProvider.getLigatabelleVeranstaltung(this.selectedVeranstaltung.id)
      .then((response: BogenligaResponse<LigatabelleErgebnisDO[]>) => this.handleLigatabelleSuccess(response, true))
      .catch(() => this.handleLigatabelleFailure());
  }

  private handleLigatabelleFailure() {
    // eslint-disable-next-line no-console
    console.log('failure');
    this.rowsLigatabelle = [];
    this.loadingLigatabelle = false;
  }

  private handleLigatabelleSuccess(response: BogenligaResponse<LigatabelleErgebnisDO[]>, isVeranstaltung: boolean) {
    this.rowsLigatabelle = [];
    this.remainingLigatabelleRequests = response.payload.length;
    if ((response.payload ?? []).length <= 0) {
      this.loadingLigatabelle = false;
    } else {
      this.rowsLigatabelle = toTableRows(response.payload);
      this.loadingLigatabelle = false;
    }
  }

  public ligatabelleLinking() {
    const link = '/wettkaempfe/';
    // Liga-Param sticky mitnehmen
    this.router.navigate([link], { queryParamsHandling: 'merge' });
  }

  public onSelectYear() {
    const buttonVisibility: HTMLInputElement | null = document.querySelector('#Button');
    if (buttonVisibility) {
      buttonVisibility.style.display = 'block';
    }

    this.veranstaltungenForYear = this.loadedVeranstaltungen.get(this.selectedYearForVeranstaltung) ?? [];
    // Wenn Liga gesetzt, wähle innerhalb des Jahres die passende Veranstaltung
    let next = this.veranstaltungenForYear[0];
    if (this.hasID && this.providedLigaID != null) {
      next = this.veranstaltungenForYear.find(v => v.ligaId === this.providedLigaID) ?? next;
    }

    this.selectedVeranstaltung = next;
    this.selectedVeranstaltungId = next?.id;
    this.selectedVeranstaltungName = next?.name;
    this.buttonForward = next?.id;

    this.loadVeranstaltung(this.selectedVeranstaltung);
  }

  public async onSelectVeranstaltung() {
    this.selectedVeranstaltungName = this.selectedVeranstaltung.name;
    this.buttonForward = this.selectedVeranstaltung.id;
    this.loadVeranstaltung(this.selectedVeranstaltung);
  }

  public async loadWettkaempfe(veranstaltungsId: number) {
    await this.wettkampfDataProviderService.findAllByVeranstaltungId(veranstaltungsId)
      .then((response: BogenligaResponse<WettkampfDO[]>) => this.handleLoadWettkaempfe(response.payload))
      .catch(() => this.handleLoadWettkaempfe([]));
  }

  public async handleLoadWettkaempfe(wettkaempfe: WettkampfDO[]) {
    this.wettkampf_ids = [];
    this.wettkampftage = [];

    for (const wk of wettkaempfe) {
      this.wettkampf_ids.push(wk.id);
    }


    const currentWettkampftag = Math.max(...(wettkaempfe).map((item) => item.wettkampfTag));
    console.log("Current Wettkampftag:", currentWettkampftag);
    for (let i = 0; i < currentWettkampftag; i++) {
      this.wettkampftage.push(this.alleTage[i]);
    }

    this.wettkampftage.push(this.alleTage[4]); // "Aktuell" (letztes Element)

    const today = new Date();
    let currentWettkampf = wettkaempfe[0];
    for (const wk of wettkaempfe) {
      const wkDate = new Date(wk.wettkampfDatum).getDate();
      if (today.getDate() > wkDate) {
        currentWettkampf = wk;
      }
    }

    // Speichere den Index des neuesten Wettkampftags
    this.latestWettkampftagIndex = currentWettkampf.wettkampfTag - 1;

    // Initialen Wettkampf (konkreter Wettkampftag) aus Router-State bevorzugen
    console.log("Initial Wettkampf ID:", this.initialWettkampfId);
    console.log("Initial Selection Applied:", this.initialSelectionApplied);
    if (!this.initialSelectionApplied && this.initialWettkampfId != null) {
      const explicitWk = wettkaempfe.find(wk => wk.id === this.initialWettkampfId);

      if (explicitWk) {
        const idx = explicitWk.wettkampfTag - 1;

        // Dropdown auf den konkreten Wettkampftag setzen (nicht "Aktuell")
        if (idx >= 0 && idx < this.wettkampftage.length) {
          this.selectedWettkampfTag = this.wettkampftage[idx];
        } else {
          // Fallback, falls Tag außerhalb des erwarteten Bereichs liegt
          this.selectedWettkampfTag = this.wettkampftage[this.wettkampftage.length - 1];
        }

        // Optional: "Aktuell" später konsistent halten
        // this.latestWettkampftagIndex = Math.max(0, idx);

        this.initialSelectionApplied = true;
        this.loadLigaTableWettkampftag(explicitWk.id);
        return;
      }
    }

    // Fallback: "Aktuell" -> currentWettkampf
    console.log("Fallback Aktuell was triggered");
    this.selectedWettkampfTag = this.wettkampftage[this.wettkampftage.length - 1];
    this.loadLigaTableWettkampftag(currentWettkampf.id);
  }

  private loadVeranstaltung(veranstaltung: VeranstaltungDO) {
    console.log("selected Veranstaltung", this.selectedVeranstaltung);
    this.selectedVeranstaltung = veranstaltung;
    // Tabelle und Wettkämpfe laden
    this.loadLigaTableRows();
    this.loadWettkaempfe(this.selectedVeranstaltung.id);
  }

  public onSelectWettkampftag() {
    let wettkampfId:  number;

    if (this.selectedWettkampfTag.id === 0) {
      // "Aktuell" ausgewählt -> lade den neuesten Wettkampftag
      wettkampfId = this.wettkampf_ids[this.latestWettkampftagIndex];
    } else {
      // Regulärer Wettkampftag ausgewählt
      const idx = this.selectedWettkampfTag.id - 1;
      if (idx >= 0 && idx < this.wettkampf_ids.length) {
        wettkampfId = this.wettkampf_ids[idx];
      } else {
        return;
      }
    }

    this.loadLigaTableWettkampftag(wettkampfId);
  }

  private loadLigaTableWettkampftag(wettkampftagId: number) {
    this.loadingWettkampftag = true;
    this.ligatabelleDataProvider.getLigatabelleWettkampf(wettkampftagId)
      .then((response: BogenligaResponse<LigatabelleErgebnisDO[]>) => this.handleLigatabelleSuccess(response, false))
      .catch(() => this.handleLigatabelleFailure());
    this.loadingWettkampftag = false;
  }

  public deselect() {
    this.isDeselected = true;
    this.router.navigate(['/ligatabelle']); // bewusst ohne :id
  }

  public goToLigaDetails(): void {
    // bevorzuge Slug aus dem Liga-Namen der ausgewählten Veranstaltung
    const ligaName = this.selectedVeranstaltung?.ligaName?.trim();
    const slug = ligaName ? slugifyLigaName(ligaName) : null;

    // Fallback: ID nutzen, falls kein Name vorhanden
    const ligaId = this.selectedVeranstaltung?.ligaId ?? this.providedLigaID;

    if (!slug && ligaId == null) {
      return;
    }

    this.router.navigate(
      ['/home'],
      {
        queryParams: { liga: slug || ligaId },
        queryParamsHandling: 'merge'
      }
    );
  }
}
