import {TableActionType} from './table-action-type.enum';

export interface TableActionConfig {
  actionTypes: TableActionType[]; // defines the icon, the label text and the action method calls
  width?: number; // optional: Override the action column width in percent, e.g. '8'
  actionColumnLocalizationKey?: string; // optional: Action column translation key
  icons?: any; // optional: Override default action icons
  localizationKeys?: any; // optional: Override default action icon title
}
