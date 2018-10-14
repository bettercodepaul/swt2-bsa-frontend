import {TableActionConfig} from './table-action-config.interface';
import {TableColumnConfig} from './table-column-config.interface';

export interface TableConfig {
  columns: TableColumnConfig[];

  actions?: TableActionConfig; // optional: Creates an action column witch action icon buttons

  pageSize?: number;
}

