import {FormPropertyType} from './form-protperty-type.enum';

export interface FormPropertyConfig {
  translationKey: string; // key of the label
  propertyName?: string; // to access the payload parameter field
  type?: FormPropertyType;
  placeholderKey?: string;
  errorMessageKey?: string;
  required?: boolean;
  regex?: string;
  min?: number;
  max?: number;
}
