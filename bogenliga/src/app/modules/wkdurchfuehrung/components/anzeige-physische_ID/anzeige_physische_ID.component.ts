import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {AnzeigenProviderService} from '@wkdurchfuehrung/services/anzeigen-provider.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription, interval} from 'rxjs';
import {WettkampfDataProviderService} from '@verwaltung/services/wettkampf-data-provider.service';
import {AnzeigenDO} from '@wkdurchfuehrung/types/anzeige-do.class';
import {WkdurchfuehrungContextService} from '@wkdurchfuehrung/services/wkdurchfuehrung-context.service';

@Component({
  selector: 'bla-screen-registration',
  templateUrl: './anzeige_physische_ID.component.html',
  styleUrls: ['./anzeige_physische_ID.component.scss']
})
export class AnzeigePhysischeIDComponent implements OnInit, OnDestroy {
  physischeBildschirmID = '';
  isFullscreen = true;
  private wettkampfId: number;
  private veranstaltungId: number;
  private wettkampftag: number;
  private registrationSubscription: Subscription;

  constructor(
    private anzeigenProvider: AnzeigenProviderService,
    private route: ActivatedRoute,
    private router: Router,
    private wettkampfDataProvider: WettkampfDataProviderService,
    private wkContextService: WkdurchfuehrungContextService
  ) {}

  async ngOnInit(): Promise<void> {
    this.loadRouteParams();
    await this.showGeneratedID();
    this.activateFullscreen();
    this.startRegistrationWatcher();
  }

  ngOnDestroy(): void {
    if (this.registrationSubscription) {
      this.registrationSubscription.unsubscribe();
    }
  }

  public async showGeneratedID(): Promise<void> {
      const response = await this.anzeigenProvider.getNewPhysischeBildschirmID();
      this.physischeBildschirmID = '' + response.payload;
  }

  private activateFullscreen(): void {
    const element = document.documentElement;

    if (element.requestFullscreen) {
      element.requestFullscreen().catch((err) => {
        console.warn('Vollbild-Anfrage fehlgeschlagen:', err);
      });
    }
  }

  private loadRouteParams(): void {
    // versucht sich die IDs vom Service zu holen
    const contextVeranstaltungId = this.wkContextService.getVeranstaltungId();
    const contextWettkampfId = this.wkContextService.getWettkampfId();
    const contextWettkampftag = this.wkContextService.getWettkampftag();

    // Fall back wenn der Service die IDs nicht hat
    if (!isNaN(contextWettkampfId)) {
      this.wettkampfId = contextWettkampfId;
    } else {
      const wettkampfIdParam = parseInt(this.route.snapshot.paramMap.get('wettkampfId'), 10);
      if (!isNaN(wettkampfIdParam)) {
        this.wettkampfId = wettkampfIdParam;
      }
    }

    if (!isNaN(contextVeranstaltungId)) {
      this.veranstaltungId = contextVeranstaltungId;
    } else {
      const veranstaltungIdParam = parseInt(this.route.snapshot.paramMap.get('veranstaltungId'), 10);
      if (!isNaN(veranstaltungIdParam)) {
        this.veranstaltungId = veranstaltungIdParam;
      }
    }

    if (!isNaN(contextWettkampftag)) {
      this.wettkampftag = contextWettkampftag;
    } else {
      const wettkampftagParam = parseInt(this.route.snapshot.paramMap.get('wettkampftag'), 10);
      if (!isNaN(wettkampftagParam)) {
        this.wettkampftag = wettkampftagParam;
      }
    }
  }

  private startRegistrationWatcher(): void {
    this.registrationSubscription = interval(2000).subscribe(async () => {
      await this.checkRegistrationAndRedirect();
    });
  }

  public async checkRegistrationAndRedirect(): Promise<void> {
    const display = await this.findRegisteredDisplay();
    if (!display) {
      return;
    }

    if (this.registrationSubscription) {
      this.registrationSubscription.unsubscribe();
    }

    if (isNaN(this.veranstaltungId)) {
      return;
    }
    const targetWettkampftag = isNaN(this.wettkampftag) ? 1 : this.wettkampftag;
    await this.router.navigate(['/wkdurchfuehrung/fullscreen', this.veranstaltungId, targetWettkampftag]);
  }

  private async findRegisteredDisplay(): Promise<AnzeigenDO> {
    const normalizedCurrentId = this.normalizeId(this.physischeBildschirmID);
    if (!normalizedCurrentId) {
      return null;
    }

    const response = !isNaN(this.wettkampfId)
      ? await this.anzeigenProvider.getByWettkampfId(this.wettkampfId)
      : await this.anzeigenProvider.findAll();

    return response.payload?.find((display) => this.normalizeId(display.physischeBildschirmId) === normalizedCurrentId);
  }

  private normalizeId(value: string): string {
    if (!value) {
      return '';
    }
    return value.trim().toUpperCase();
  }

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (document.fullscreenElement) {
      document.exitFullscreen();
      this.isFullscreen = false;
    }
  }

}
