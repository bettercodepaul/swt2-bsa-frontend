import {OverviewDialogConfig} from '../../../shared/components/dialogs';
import {TableActionType} from '../../../shared/components/tables/types/table-action-type.enum';
import {UserPermission} from '@shared/services';

export const MIGRATION_OVERVIEW_CONFIG: OverviewDialogConfig = {
  moduleTranslationKey:    'MANAGEMENT',
  pageTitleTranslationKey: 'MANAGEMENT.MIGRATION.TITLE',

  tableConfig: {
    columns: [
      {
        translationKey: 'MANAGEMENT.MIGRATION.TABLE.HEADERS.TIMESTAMP',
        propertyName:   'migrationTimestamp',
        width:          20,
      },
      {
        translationKey: 'MANAGEMENT.MIGRATION.TABLE.HEADERS.DESCRIPTION',
        propertyName:   'migrationDescription',
        width:          20,
      },
      {
        translationKey: 'MANAGEMENT.MIGRATION.TABLE.HEADERS.STATUS',
        propertyName:   'migrationStatus',
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
