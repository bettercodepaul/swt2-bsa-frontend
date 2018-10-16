import {Component, Input, OnInit} from '@angular/core';
import {FormConfig} from '../types/form-config.interface';
import {FormContent} from '../types/form-content.class';
import {CommonComponent} from '../../common';
import {FormPropertyConfig} from '../types/form-property-config.interface';
import {FormPropertyType} from '../types/form-protperty-type.enum';
import {isNullOrUndefined} from 'util';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';

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

  public form: FormGroup;

  public dummy = {name: ''};

  get propertyForms() {
    return this.form.get('properties') as FormArray
  }

  constructor(private formBuilder: FormBuilder) {
    super();
  }

  ngOnInit() {


    this.form = this.formBuilder.group({
      properties: this.formBuilder.array([])
    });

    //this.config.properties.forEach(this.addProperty);

  }


  addProperty(property: FormPropertyConfig) {

    const propertyFormGroup = this.formBuilder.group({
      propertyName: ['', Validators.required]
    });

    this.propertyForms.push(propertyFormGroup);
  }

  public showContent(): boolean {
    return !this.loading && !isNullOrUndefined(this.content);
  }

  public getPropteryType(property: FormPropertyConfig): string {
    switch (property.type) {
      case FormPropertyType.PASSWORD:
        return 'password';
      case FormPropertyType.NUMBER:
        return 'number';
      case FormPropertyType.TEXT:
      default:
        return 'text';
    }
  }
}
