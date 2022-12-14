import {Component, OnInit} from '@angular/core';
import {environment} from '../../../../../environments/environment';
import {PLAYGROUND_CONFIG} from './playground.config';
import {SessionHandling} from '@shared/event-handling';
import {CurrentUserService, OnOfflineService} from '@shared/services';

@Component({
  selector:    'bla-playground',
  templateUrl: './playground.component.html',
  styleUrls:   ['./playground.component.scss']
})
export class PlaygroundComponent implements OnInit {

  public config = PLAYGROUND_CONFIG;
  public inProd = environment.production;

  private sessionHandling: SessionHandling;

  constructor(private currentUserService: CurrentUserService,
    private onOfflineService: OnOfflineService,) {
    this.sessionHandling = new SessionHandling(this.currentUserService, this.onOfflineService);
  }

  ngOnInit() {
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
