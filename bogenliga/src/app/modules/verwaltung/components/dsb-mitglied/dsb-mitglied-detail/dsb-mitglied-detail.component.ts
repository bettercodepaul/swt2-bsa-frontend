import {Component, OnInit} from '@angular/core';
import {DSB_MITGLIED_DETAIL_CONFIG} from './dsb-mitglied-detail.config';

@Component({
  selector:    'bla-dsb-mitglied-detail',
  templateUrl: './dsb-mitglied-detail.component.html',
  styleUrls:   ['./dsb-mitglied-detail.component.scss']
})
export class DsbMitgliedDetailComponent implements OnInit {

  public config = DSB_MITGLIED_DETAIL_CONFIG;

  constructor() {
  }

  ngOnInit() {
  }

}
