import {Component, OnInit} from '@angular/core';
import {SPORTJAHRESPLAN_CONFIG} from './sportjahresplan.config';

@Component({
  selector:    'bla-sportjahresplan',
  templateUrl: './sportjahresplan.component.html',
  styleUrls:   ['./sportjahresplan.component.scss']
})
export class SportjahresplanComponent implements OnInit {

  public config = SPORTJAHRESPLAN_CONFIG;

  constructor() {
  }

  ngOnInit() {
  }

}
