import { Component, OnInit } from '@angular/core';
import {HILFE_CONFIG} from './hilfe.config';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'bla-components',
  templateUrl: './hilfe.component.html',
  styleUrls: ['./hilfe.component.scss']
})

export class HilfeComponent implements OnInit {
  public config = HILFE_CONFIG;
  public wikiUrl:any;
  public sectionSelected:any;

  /* Hier können weitere Sektionen angelegt werden (schema beachten mit id und url)*/
  public sections:Array<any> = [
    {
      id: 'Startseite',
      url: 'https://wiki.bsapp.de/doku.php?id=liga:ligasoftware'
    },
    {
      id: 'Arbeitsablauf als Ligaleiter',
      url: 'https://wiki.bsapp.de/doku.php?id=liga:arbeitsablauf'
    },
    {
      id: 'Wettkampfdurchführung',
      url: 'https://wiki.bsapp.de/doku.php?id=liga:wettkampfdurchfuehrung'
    }
  ]
  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
  }

  setUrl(url) {
    this.wikiUrl = url
    this.sectionSelected = true
  }

  getSecureUrl() {
    return this.sanitizer.
      bypassSecurityTrustResourceUrl(this.wikiUrl)
  }
}
