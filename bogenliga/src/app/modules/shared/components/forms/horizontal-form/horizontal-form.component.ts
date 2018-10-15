import {Component, Input, OnInit} from '@angular/core';
import {FormConfig} from '../types/form-config.interface';
import {FormContent} from '../types/form-content.class';
import {CommonComponent} from '../../common';

@Component({
  selector:    'bla-horizontal-form',
  templateUrl: './horizontal-form.component.html',
  styleUrls:   ['./horizontal-form.component.scss']
})
export class HorizontalFormComponent extends CommonComponent implements OnInit {

  @Input()
  public config: FormConfig;

  @Input()
  public content: FormContent;


  constructor() {
    super();
  }

  ngOnInit() {
  }

}
