import {OverviewDialogConfig} from '../../../shared/components/dialogs';
import {TableActionType} from '../../../shared/components/tables/types/table-action-type.enum';
import {UserPermission} from '@shared/services';

export const MIGRATION_OVERVIEW_CONFIG: OverviewDialogConfig = {
  moduleTranslationKey:    'MANAGEMENT',
  pageTitleTranslationKey: 'MANAGEMENT.MIGRATION_DETAIL.TITLE',

  tableConfig: {
    columns: [
      {
        translationKey: 'MANAGEMENT.MIGRATION.TABLE.HEADERS.OLD',
        propertyName:   'altsystemId',
        width:          10,
      },
      {
        translationKey: 'MANAGEMENT.MIGRATION.TABLE.HEADERS.TABLENAME',
        propertyName:   'kategorie',
        width:          20,
      },
      {
        translationKey: 'MANAGEMENT.MIGRATION.TABLE.HEADERS.OPERATION',
        propertyName:   'operation',
        width:          20,
      },
      {
        translationKey: 'MANAGEMENT.MIGRATION.TABLE.HEADERS.STATUS',
        propertyName:   'status',
        width:          10,
      },
      {
        translationKey: 'MANAGEMENT.MIGRATION.TABLE.HEADERS.MESSAGE',
        propertyName:   'nachricht',
        width:          20,
      },
      {
        translationKey: 'MANAGEMENT.MIGRATION.TABLE.HEADERS.TIMESTAMP',
        propertyName:   'runAtUtc',
        width:          20,
      },

    ],

    editPermission : [UserPermission.CAN_MODIFY_SYSTEMDATEN],
    deletePermission : [UserPermission.CAN_DELETE_SYSTEMDATEN]
  },
  createPermission : [UserPermission.CAN_CREATE_SYSTEMDATEN]
};
