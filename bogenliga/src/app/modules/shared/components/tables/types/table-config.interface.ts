import {TableActionConfig} from './table-action-config.interface';
import {TableColumnConfig} from './table-column-config.interface';
import {UserPermission} from '@shared/services';

export interface TableConfig {
  columns: TableColumnConfig[];

  actions?: TableActionConfig; // optional: Creates an action column witch action icon buttons

  pageSize?: number;

  editPermission?: UserPermission[];
  viewPermission?: UserPermission[];
  deletePermission?: UserPermission[];
  addPermission?: UserPermission[];
  downloadPermission?: UserPermission[];
  mapPermission?: UserPermission[];
  buttonVersion2?: boolean; // In case buttons should be displayed colored and with text
}

