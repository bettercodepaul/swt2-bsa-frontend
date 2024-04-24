import { Component, OnInit } from '@angular/core';
import { SessionHandling } from '@shared/event-handling';
import { CurrentUserService, OnOfflineService } from '@shared/services';
import { CommonComponentDirective} from '@shared/components';
import { ActionButtonColors } from '@shared/components/buttons/button/actionbuttoncolors';
import { LIGATABELLE_TABLE_CONFIG, WETTKAEMPFE_CONFIG } from '../../../ligatabelle/components/ligatabelle/ligatabelle.config';
import { interval, Subscription } from 'rxjs';

interface LigatabelleEntry {
  platz: number;
  mannschaft: string;
  matchpunkte: string;
  satzpunkte: string;
  satzpunktdifferenz: number;
}
@Component({
  selector: 'bla-fullscreen',
  templateUrl: './fullscreen.component.html',
  styleUrls: ['./fullscreen.component.scss']
})
export class FullscreenComponent extends CommonComponentDirective implements OnInit {

  private sessionHandling: SessionHandling;
  public config = WETTKAEMPFE_CONFIG;
  public config_table = LIGATABELLE_TABLE_CONFIG;
  public ActionButtonColors = ActionButtonColors;
  public loading = true;
  public multipleSelections = true;

  currentTime: string;
  private timeSubscription: Subscription;

  //work in process -> Daten für die Visualisierung des Mockups
  public ligatabelleData: LigatabelleEntry[] = [
    { platz: 1, mannschaft: 'BSC Geislingen Steige-2', matchpunkte: '11 : 3', satzpunkte: '39 : 21', satzpunktdifferenz: 18 },
    { platz: 2, mannschaft: 'SK Fellbach Schmiden-0', matchpunkte: '11 : 3', satzpunkte: '37 : 21', satzpunktdifferenz: 16 },
    { platz: 3, mannschaft: 'SV Mögglingen-0', matchpunkte: '8 : 6', satzpunkte: '32 : 24', satzpunktdifferenz: 8 },
    { platz: 4, mannschaft: 'SGi Welzheim-3', matchpunkte: '8 : 6', satzpunkte: '32 : 28', satzpunktdifferenz: 4 },
    { platz: 5, mannschaft: 'SSV Steinheim Albuch-0', matchpunkte: '7 : 7', satzpunkte: '32 : 26', satzpunktdifferenz: 6 },
    { platz: 6, mannschaft: 'BSV Brackenheim-0', matchpunkte: '7 : 7', satzpunkte: '27 : 29', satzpunktdifferenz: -2 },
    { platz: 7, mannschaft: 'SGi Ditzingen-3', matchpunkte: '4 : 10', satzpunkte: '23 : 31', satzpunktdifferenz: -8 },
    { platz: 8, mannschaft: 'SV Weil im Schönbuch-0', matchpunkte: '0 : 14', satzpunkte: '0 : 42', satzpunktdifferenz: -42 }
  ];

  constructor(
    private onOfflineService: OnOfflineService,
    private currentUserService: CurrentUserService,
  ) {
    super();
    this.sessionHandling = new SessionHandling(this.currentUserService, this.onOfflineService);
  }

  ngOnInit() {
    this.startClock();
  }

  startClock() {
    this.currentTime = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });
    this.timeSubscription = interval(60000).subscribe(() => {
      this.currentTime = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });
    });
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

}
