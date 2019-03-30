import {TableConfig} from '../../tables/types/table-config.interface';
import {CommonDialogConfig} from './common-dialog-config.interface';

export interface SimpleOverviewDialogConfig extends CommonDialogConfig {
  tableConfig: TableConfig;
}
