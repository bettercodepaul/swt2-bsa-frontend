import {Component, ElementRef, OnInit, ViewChild, Input} from '@angular/core';
import {environment} from '@environment';
import {UriBuilder} from '../../../data-provider';

@Component({
  selector: 'bla-rueckennummern-download',
  templateUrl: './rueckennummern-download.component.html'
})
export class RueckennummernDownloadComponent implements OnInit {

  // Get the value of the attribute from the html tag
  @Input()
  mannschaftid: number;

  @ViewChild('downloadLink')
  private aElementRef: ElementRef;

  constructor() {}

  ngOnInit() {}

  //path: v1/download/pdf/rueckennummern?mannschaftid={this.mannschaftid}
  public getDownloadUrl(path: string): string {
    return new UriBuilder()
      .fromPath(environment.backendBaseUrl)
      .path('v1/download')
      .path(path)
      .path('?mannschaftid=' + this.mannschaftid)
      .build();
  }
}
