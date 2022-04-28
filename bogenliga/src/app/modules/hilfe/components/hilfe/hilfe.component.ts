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
  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
  }

  getWikiUrl() {
    return this.sanitizer.
      bypassSecurityTrustResourceUrl("https://wiki.bsapp.de/doku.php")
  }

}
