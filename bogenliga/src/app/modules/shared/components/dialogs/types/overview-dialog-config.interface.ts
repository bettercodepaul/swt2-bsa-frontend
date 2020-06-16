import {TableConfig} from '../../tables/types/table-config.interface';
import {CommonDialogConfig} from './common-dialog-config.interface';
import {UserPermission} from '@shared/services';

export interface OverviewDialogConfig extends CommonDialogConfig {
  tableConfig: TableConfig;
  createPermission?: UserPermission[];
}
