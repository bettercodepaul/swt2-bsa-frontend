import {CommonDialogConfig} from './common-dialog-config.interface';
import {TableConfig} from '../../tables/types/table-config.interface';

export interface SimpleOverviewDialogConfig extends CommonDialogConfig {
  tableConfig: TableConfig;
}
