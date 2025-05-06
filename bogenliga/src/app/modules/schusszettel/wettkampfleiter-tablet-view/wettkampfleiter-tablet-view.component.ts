import { Component, OnInit } from '@angular/core';
import { SpotterService } from '../../spotter/services/spotter.service';
import { TabletSessionProviderService } from '@wkdurchfuehrung/services/tablet-session-provider.service';
import { TabletSessionDO } from '@wkdurchfuehrung/types/tablet-session-do.class';
import {RequestResult} from '@shared/data-provider';


@Component({
  selector: 'bla-wettkampfleiter-tablet-view',
  templateUrl: './wettkampfleiter-tablet-view.component.html',
  styleUrls: ['./wettkampfleiter-tablet-view.component.scss']
})
export class WettkampfleiterTabletViewComponent implements OnInit {

  wkID: string;
  scheibe: number;
  session: TabletSessionDO;
  tabletUrl: string;

  constructor(
    private spotterService: SpotterService,
    private tabletSessionService: TabletSessionProviderService
  ) { }

  ngOnInit(): void {
    const { wkId, schreibe } = this.spotterService.getWettkampfIDundScheibe();
    this.wkID = wkId;
    this.scheibe = parseInt(schreibe, 10);
    this.tabletUrl = `${location.origin}/tablet/${this.wkID}/${this.scheibe}`;

    this.loadSession();
  }

  async loadSession() {
    const result = await this.tabletSessionService.findTabletSession(this.wkID, this.scheibe.toString());
    if (result.result === RequestResult.SUCCESS) {
      this.session = result.payload;
    } else {
      console.error('Session konnte nicht geladen werden');
    }
  }

  async freigabeSchuetzen() {
    await this.tabletSessionService.toggleSessionActiveState(this.session, true);
  }

  async freigabeSatz() {
    // TODO: Eigener API-Endpunkt für Satzfreigabe
    alert('Satzfreigabe wurde ausgelöst');
  }

  async zuruecksetzen() {
    await this.tabletSessionService.toggleSessionActiveState(this.session, false);
  }

  copyLink() {
    navigator.clipboard.writeText(this.tabletUrl);
    alert('Link kopiert!');
  }

}
