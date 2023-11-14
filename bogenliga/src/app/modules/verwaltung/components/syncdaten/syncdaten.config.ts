import {OverviewDialogConfig} from '../../../shared/components/dialogs';
import {TableActionType} from '../../../shared/components/tables/types/table-action-type.enum';
import {UserPermission} from '@shared/services';

export const SYNC_OVERVIEW_CONFIG: OverviewDialogConfig = {
  moduleTranslationKey:    'MANAGEMENT',
  pageTitleTranslationKey: 'MANAGEMENT.SYNC.TITLE',

  tableConfig: {
    columns: [
      {
        translationKey: 'MANAGEMENT.SYNC.TABLE.HEADERS.TIMESTAMP',
        propertyName:   'syncTimestamp',
        width:          20,
      },
      {
        translationKey: 'MANAGEMENT.SYNC.TABLE.HEADERS.DESCRIPTION',
        propertyName:   'syncDescription',
        width:          20,
      },
      {
        translationKey: 'MANAGEMENT.SYNC.TABLE.HEADERS.STATUS',
        propertyName:   'syncStatus',
        width:          20,
      },
    ],
    actions: {
      actionTypes: [TableActionType.EDIT, TableActionType.DELETE],
      width:       6
    },
    editPermission : [UserPermission.CAN_MODIFY_SYSTEMDATEN],
    deletePermission : [UserPermission.CAN_DELETE_SYSTEMDATEN]
  },
  createPermission : [UserPermission.CAN_CREATE_SYSTEMDATEN]
};
