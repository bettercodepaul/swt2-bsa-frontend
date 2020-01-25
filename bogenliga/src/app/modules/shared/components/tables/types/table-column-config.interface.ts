import {TableColumnDateFormat} from './table-column-date-format.interface';
import {TableColumnSortOrder} from './table-column-sort-order.enum';
import {TableColumnType} from './table-column-type.enum';

export interface TableColumnConfig {
  /* tslint:disable */
  translationKey: string; // key of the column
  propertyName?: string; // to access the payload parameter field
  propertyMapper?: Function; // if defined maps extracted property

  type?: TableColumnType; // optional: Use a specific data type pipe; default = TEXT
  localizationSet?: string; // optional: Used with TableColumnType.TRANSLATION_KEY
  width?: number; // optional: Set the column width in percent, e.g. '25'; default = width of content
  sortable?: boolean; // optional: Declare a sortable column; default = true
  currentSortOrder?: TableColumnSortOrder; // optional: Use a predefined sort order; default = UNSORTED
  dateAndTimeFormat?: TableColumnDateFormat; // optional: Define a custom date format, e.g. 'yyy-MM-dd'
  truncationLength?: number; // optional: Define a truncation length to cut the text after X chars
  notLigatabelle?: boolean; // optional: only for the ligatabelle; default = true

  stylesMapper?: Function; // optional: you can change the style of the column

  mappingFunction?: Function; // optional: you can change the value of a cell (enum -> string, boolean -> string)
  /* tslint:enable */
}
