import {VersionedDataObject} from '../../../data-provider/models/versioned-data-object.interface';
import {DataObject} from '../../../data-provider';
import {FormActionType} from './form-action-type.enum';
import {isNullOrUndefined} from 'util';
import {FormPropertyConfig} from './form-property-config.interface';

export class FormContent implements DataObject {
  payload: VersionedDataObject;
  disabledActions: FormActionType[];
  hiddenActions: FormActionType[];
  loadingActions: FormActionType[];

  public static copyFrom(sourceObject: any): FormContent {
    const formContent = new FormContent();

    formContent.payload = sourceObject.payload;
    formContent.disabledActions = sourceObject.disabledActions;
    formContent.hiddenActions = sourceObject.hiddenActions;
    formContent.loadingActions = sourceObject.loadingActions;

    return formContent;
  }

  constructor(optional: {
    payload?: VersionedDataObject,
    disabledActions?: FormActionType[]
    hiddenActions?: FormActionType[]
    loadingActions?: FormActionType[]
  } = {}) {
    this.payload = optional.payload || null;
    this.disabledActions = optional.disabledActions || [];
    this.hiddenActions = optional.hiddenActions || [];
    this.loadingActions = optional.loadingActions || [];
  }

  /**
   * gets text from this property
   **
   * @param {FormPropertyConfig} property
   * @returns {string}
   */
  public getText(property: FormPropertyConfig): string {
    let extractedAttribute;
    if (isNullOrUndefined(property.propertyName) || property.propertyName.length === 0) {
      extractedAttribute = this.payload;
    } else {
      extractedAttribute = this.resolveNestedObjectProperties(property.propertyName);
    }

    return extractedAttribute;
  }

  private resolveNestedObjectProperties(path) {
    try {
      const separator = '.';

      return path.replace('[', separator).replace(']', '').split(separator).reduce(
        function (obj, property) {
          return obj[property];
        }, this.payload
      );

    } catch (err) {
      return undefined;
    }
  }
}
