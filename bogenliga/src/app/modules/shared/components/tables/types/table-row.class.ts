import {isNullOrUndefined} from '@shared/functions';
import {VersionedDataObject} from '../../../data-provider/models/versioned-data-object.interface';
import {TableActionType} from './table-action-type.enum';
import {TableColumnConfig} from './table-column-config.interface';

export class TableRow {
  payload: VersionedDataObject;
  disabledActions: TableActionType[];
  hiddenActions: TableActionType[];
  loadingActions: TableActionType[];

  public static copyFrom(sourceObject: any): TableRow {
    const row = new TableRow();

    row.payload = sourceObject.payload;
    row.disabledActions = sourceObject.disabledActions;
    row.hiddenActions = sourceObject.hiddenActions;
    row.loadingActions = sourceObject.loadingActions;

    return row;
  }

  constructor(optional: {
    payload?: VersionedDataObject,
    disabledActions?: TableActionType[]
    hiddenActions?: TableActionType[]
    loadingActions?: TableActionType[]
  } = {}) {
    this.payload = optional.payload || null;
    this.disabledActions = optional.disabledActions || [];
    this.hiddenActions = optional.hiddenActions || [];
    this.loadingActions = optional.loadingActions || [];
  }


  /**
   * gets text from this row at the given column
   *
   * we apply propertyMapper if defined and propertyName
   *
   * @param {TableColumnConfig} column
   * @returns {string}
   */
  public getText(column: TableColumnConfig): string {
    let extractedAttribute;
    if (isNullOrUndefined(column.propertyName) || column.propertyName.length === 0) {
      extractedAttribute = this.payload;
    } else {
      extractedAttribute = this.resolveNestedObjectProperties(column.propertyName);
    }

    if (!isNullOrUndefined(column.propertyMapper)) {
      return String(column.propertyMapper(extractedAttribute));
    } else {
      if (isNullOrUndefined(extractedAttribute)) {
        return '';
      } else {
        return String(extractedAttribute);
      }
    }
  }

  private resolveNestedObjectProperties(path) {
    try {
      const separator = '.';

      return path.replace('[', separator).replace(']', '').split(separator).reduce(
        function getNestedProperty(obj, property) {
          return obj[property];
        }, this.payload
      );

    } catch (err) {
      return undefined;
    }
  }
}
