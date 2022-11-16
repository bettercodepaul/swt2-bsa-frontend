import {Component, OnInit} from '@angular/core';
import {HILFE_CONFIG} from './hilfe.config';
import {DomSanitizer} from '@angular/platform-browser';
import {SessionHandling} from '@shared/event-handling';
import {CurrentUserService} from '@shared/services';

@Component({
  selector:    'bla-components',
  templateUrl: './hilfe.component.html',
  styleUrls:   ['./hilfe.component.scss']
})

export class HilfeComponent implements OnInit {
  public config = HILFE_CONFIG;
  public wikiUrl: any;
  public sectionSelected: any;
  /* Hier können weitere Sektionen angelegt werden (schema beachten mit id und url)*/
  public sections: Array<any> = [
    {
      id: 'Startseite',
      url: 'https://wiki.bsapp.de/doku.php?id=liga:startseite',
      cy_test: 'test-startseite' // id for cypress tests
    },
    {
      id:      'Ablauf Ligaleiter',
      url:     'https://wiki.bsapp.de/doku.php?id=liga:arbeitsablauf',
      cy_test: 'test-ligaleiter' // id for cypress tests
    },
    {
      id:      'Wettkampfdurchführung',
      url:     'https://wiki.bsapp.de/doku.php?id=liga:wettkampfdurchfuehrung',
      cy_test: 'test-wkd' // id for cypress tests
    }
  ];
  private sessionHandling: SessionHandling;

  constructor(private sanitizer: DomSanitizer,
    private currentUserService: CurrentUserService) {
    this.sessionHandling = new SessionHandling(this.currentUserService);
  }

  ngOnInit(): void {
    this.setUrl(this.sections[0].url);
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

  setUrl(url) {
    this.wikiUrl = url;
    this.sectionSelected = true;
  }

  getSecureUrl() {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.wikiUrl);
  }
}
