import {OverviewDialogConfig} from '@shared/components';
import {TableActionType} from '@shared/components/tables/types/table-action-type.enum';
import {TableColumnType} from '@shared/components/tables/types/table-column-type.enum';
import {UserPermission} from '@shared/services';

export const EINSTELLUNGEN_OVERVIEW_CONFIG: OverviewDialogConfig = {
  moduleTranslationKey: 'MANAGEMENT',
  pageTitleTranslationKey: 'MANAGEMENT.EINSTELLUNGEN.TITLE',

  tableConfig: {
    columns: [
    ],
    actions: {
      actionTypes: [TableActionType.EDIT],
      width: 6
    },
    editPermission : [UserPermission.CAN_MODIFY_STAMMDATEN],
    deletePermission : [UserPermission.CAN_DELETE_STAMMDATEN]

  },
  createPermission : [UserPermission.CAN_CREATE_STAMMDATEN]
};

