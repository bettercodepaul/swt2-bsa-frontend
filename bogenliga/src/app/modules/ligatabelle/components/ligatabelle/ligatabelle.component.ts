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

  public providedID: number | undefined; // Liga-ID aus Resolver
  private hasID = false;
  private hasVeranstaltung = true;

  private isDeselected = false;
  private remainingLigatabelleRequests: number;

  private loadedVeranstaltungen: Map<number, VeranstaltungDO[]>;
  public selectedVeranstaltung: VeranstaltungDO;
  public loadedYears: SportjahrVeranstaltungDO[] = [];
  public availableYears: SportjahrVeranstaltungDO[] = [];
  public veranstaltungenForYear: VeranstaltungDO[] = [];

  private veranstaltungIdMap: Map<number, VeranstaltungDO>;

  public selectedVeranstaltungId: number;
  public selectedYearId: number;
  public selectedItemId: number;
  private aktivesSportjahr: number;
  public selectedYearForVeranstaltung: number; // In der Tabelle selektiertes Sportjahr
  private istURLkorrekt = false;
  private currentWettkampftag: number;
  public loadingWettkampftag = true;
  public wettkampf_ids: number[] = [];
  public selectedWettkampfTag: Wettkampftag;
  public wettkampftage: Array<Wettkampftag> = [];
  public alleTage: Array<Wettkampftag> = [
    { id: 1, name: 'MANNSCHAFTEN.DROPDOWNWETTKAMPFTAGE.OPTION1.LABEL' },
    { id: 2, name: 'MANNSCHAFTEN.DROPDOWNWETTKAMPFTAGE.OPTION2.LABEL' },
    { id: 3, name: 'MANNSCHAFTEN.DROPDOWNWETTKAMPFTAGE.OPTION3.LABEL' },
    { id: 4, name: 'MANNSCHAFTEN.DROPDOWNWETTKAMPFTAGE.OPTION4.LABEL' },
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
    // Liga aus Resolver (QueryParam ?liga=...) übernehmen
    const ligaFromResolver = this.route.snapshot.data['liga'] as LigaDO | null | undefined;
    if (ligaFromResolver?.id != null) {
      this.providedID = ligaFromResolver.id;
      this.hasID = true;
    } else {
      this.providedID = undefined;
      this.hasID = false;
    }

    if (this.isDeselected === false) {
      await this.loadTableData();
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
    this.availableYears = [];
    this.loadedVeranstaltungen = new Map();
    this.veranstaltungIdMap = new Map();

    try {
      // Jahre laden
      const responseYear = await this.veranstaltungsDataProvider.findAllSportyearDestinct();
      this.loadedYears = responseYear.payload ?? [];

      // Veranstaltungen pro Jahr laden
      await Promise.all(
        this.loadedYears.map(async (year) => {
          const responseVeranstaltung = await this.veranstaltungsDataProvider.findBySportjahrDestinct(year.sportjahr);
          const list = responseVeranstaltung.payload ?? [];

          for (const v of list) {
            this.veranstaltungIdMap.set(v.id, v);
          }
          if (list.length > 0) {
            this.loadedVeranstaltungen.set(year.sportjahr, list);
            if (!this.availableYears.find(y => y.sportjahr === year.sportjahr)) {
              this.availableYears.push(year);
            }
          }
        })
      );

      // Absteigend sortieren (neuestes Jahr zuerst)
      this.availableYears.sort((a, b) => b.sportjahr - a.sportjahr);

      // Aktives Sportjahr
      if (!this.onOfflineService.isOffline()) {
        this.aktivesSportjahr = await getActiveSportYear(this.einstellungenDataProvider);
      }

      // Auswahl initialisieren
      const initialIndex = Math.max(0, this.availableYears.findIndex(y => y.sportjahr === this.aktivesSportjahr));
      this.selectedYearId = this.availableYears[initialIndex]?.id;
      this.selectedYearForVeranstaltung = this.availableYears[initialIndex]?.sportjahr;

      this.veranstaltungenForYear = this.loadedVeranstaltungen.get(this.selectedYearForVeranstaltung) ?? [];

      // Wähle Veranstaltung:
      // - Wenn Liga (providedID) gesetzt: Veranstaltung mit passender ligaId, sonst fallback auf erstes Element
      let initialVeranstaltung: VeranstaltungDO | undefined;
      if (this.hasID && this.providedID != null) {
        initialVeranstaltung = this.veranstaltungenForYear.find(v => v.ligaId === this.providedID);
        if (!initialVeranstaltung) {
          // Optional: versuche genaue Veranstaltung via Service (ein Jahr kann mehrere Ligen haben)
          try {
            const resp = await this.veranstaltungsDataProvider.findByLigaIdAndYear(this.providedID, this.selectedYearForVeranstaltung);
            if (resp?.payload?.id != null) {
              initialVeranstaltung = resp.payload;
            }
          } catch {
            // ignore
          }
        }
      }
      if (!initialVeranstaltung) {
        initialVeranstaltung = this.veranstaltungenForYear[0];
      }

      if (initialVeranstaltung) {
        this.loadVeranstaltung(initialVeranstaltung);
        this.selectedVeranstaltungId = initialVeranstaltung.id;
        this.selectedVeranstaltungName = initialVeranstaltung.name;
        this.buttonForward = initialVeranstaltung.id;
      }

      this.loading = false;
      this.loadingLigatabelle = false;
    } catch (e) {
      this.loading = false;
      this.loadingLigatabelle = false;
      // eslint-disable-next-line no-console
      console.log(e);
    }
  }

  private loadLigaTableRows() {
    this.loadingLigatabelle = true;
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
    const link = '/wettkaempfe/' + this.buttonForward;
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
    if (this.hasID && this.providedID != null) {
      next = this.veranstaltungenForYear.find(v => v.ligaId === this.providedID) ?? next;
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
    for (let i = 0; i < currentWettkampftag; i++) {
      this.wettkampftage.push(this.alleTage[i]);
    }

    const today = new Date();
    let currenWettkampf = wettkaempfe[0];
    for (const wk of wettkaempfe) {
      const wkDate = new Date(wk.wettkampfDatum).getDate();
      if (today.getDate() > wkDate) {
        currenWettkampf = wk;
      }
    }
    this.selectedWettkampfTag = this.wettkampftage[currenWettkampf.wettkampfTag - 1];
    this.loadLigaTableWettkampftag(currenWettkampf.id);
  }

  private loadVeranstaltung(veranstaltung: VeranstaltungDO) {
    this.selectedVeranstaltung = veranstaltung;
    // Tabelle und Wettkämpfe laden
    this.loadLigaTableRows();
    this.loadWettkaempfe(this.selectedVeranstaltung.id);
  }

  public onSelectWettkampftag() {
    const idx = this.selectedWettkampfTag.id - 1;
    if (idx >= 0 && idx < this.wettkampf_ids.length) {
      this.loadLigaTableWettkampftag(this.wettkampf_ids[idx]);
    }
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
    const ligaId = this.selectedVeranstaltung?.ligaId ?? this.providedID;

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
